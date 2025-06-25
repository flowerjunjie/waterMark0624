const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 确保public目录存在
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 将favicon.ico复制为app-icon.png (如果存在)
try {
  const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
  const appIconPath = path.join(__dirname, 'public', 'app-icon.png');
  
  if (fs.existsSync(faviconPath)) {
    console.log('使用favicon.ico作为源图标');
    // 复制favicon.ico到app-icon.png
    fs.copyFileSync(faviconPath, appIconPath);
    console.log('已复制favicon.ico到app-icon.png');
  } else {
    console.log('favicon.ico不存在，请确保有一个图标文件');
    process.exit(1);
  }
  
  // 修改electron-builder.json配置
  const configPath = path.join(__dirname, 'electron-builder.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // 使用app-icon.ico
  config.win.icon = 'public/app-icon.ico';
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('已更新electron-builder.json配置');
  
  // 修改electron.js配置
  const electronJsPath = path.join(__dirname, 'electron.js');
  let electronJs = fs.readFileSync(electronJsPath, 'utf8');
  
  electronJs = electronJs.replace(
    /icon: path.join\(__dirname, ['"]public\/.*?['"]\)/,
    'icon: path.join(__dirname, \'public/app-icon.ico\')'
  );
  
  fs.writeFileSync(electronJsPath, electronJs);
  console.log('已更新electron.js配置');
  
  // 创建正确格式的图标
  console.log('正在创建图标...');
  execSync('npx electron-icon-builder --input=./public/app-icon.png --output=./public --flatten');
  console.log('图标创建完成');
  
} catch (err) {
  console.error('错误:', err);
  process.exit(1);
}