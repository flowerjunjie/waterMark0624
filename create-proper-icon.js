const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating proper icon file...');

try {
  // Copy favicon.ico to app-icon.ico
  const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
  const appIconPath = path.join(__dirname, 'public', 'app-icon.ico');
  
  if (fs.existsSync(faviconPath)) {
    console.log('Copying favicon.ico to app-icon.ico');
    fs.copyFileSync(faviconPath, appIconPath);
    console.log('Copy complete');
  } else {
    console.log('favicon.ico does not exist');
  }
  
  // 更新electron-builder.json配置
  const configPath = path.join(__dirname, 'electron-builder.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // 确保包含public目录
  if (!config.files.includes('public/**/*')) {
    config.files.push('public/**/*');
  }
  
  // 使用favicon.ico
  config.win.icon = 'public/favicon.ico';
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('已更新electron-builder.json配置');
  
  // 更新electron.js配置
  const electronJsPath = path.join(__dirname, 'electron.js');
  let electronJs = fs.readFileSync(electronJsPath, 'utf8');
  
  electronJs = electronJs.replace(
    /icon: path.join\(__dirname, ['"]public\/.*?['"]\)/,
    'icon: path.join(__dirname, \'public/favicon.ico\')'
  );
  
  fs.writeFileSync(electronJsPath, electronJs);
  console.log('已更新electron.js配置');
  
} catch (err) {
  console.error('错误:', err);
  process.exit(1);
} 