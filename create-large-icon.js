const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating large icon file (256x256)...');

// 创建一个256x256的PNG图标
const size = 256;
const iconBuffer = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="#3498db"/>
  <text x="50%" y="50%" font-family="Arial" font-size="72" fill="white" text-anchor="middle" dominant-baseline="middle">水印</text>
</svg>
`);

// 保存为PNG
sharp(iconBuffer)
  .png()
  .toFile(path.join(__dirname, 'public', 'large-icon.png'), (err, info) => {
    if (err) {
      console.error('创建PNG失败:', err);
      return;
    }
    
    console.log('创建大尺寸PNG成功');
    
    // 安装png-to-ico如果需要
    try {
      require.resolve('png-to-ico');
    } catch (e) {
      console.log('安装png-to-ico...');
      execSync('npm install --save-dev png-to-ico');
    }
    
    // 转换为ICO
    const pngToIco = require('png-to-ico');
    pngToIco(path.join(__dirname, 'public', 'large-icon.png'))
      .then(buf => {
        fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), buf);
        console.log('ico文件创建成功: public/favicon.ico');
        
        // 更新配置文件
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
        
        // 更新electron.js
        const electronJsPath = path.join(__dirname, 'electron.js');
        let electronJs = fs.readFileSync(electronJsPath, 'utf8');
        
        electronJs = electronJs.replace(
          /icon: path\.join\(__dirname, ['"]public\/.*?['"]\)/,
          'icon: path.join(__dirname, \'public/favicon.ico\')'
        );
        
        fs.writeFileSync(electronJsPath, electronJs);
        console.log('已更新electron.js配置');
      })
      .catch(icoErr => {
        console.error('转换为ICO失败:', icoErr);
      });
  }); 