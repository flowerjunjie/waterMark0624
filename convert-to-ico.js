const fs = require('fs');
const pngToIco = require('png-to-ico');

// 将PNG转换为ICO
pngToIco('./public/app-icon.png')
  .then(buf => {
    fs.writeFileSync('./public/app-icon.ico', buf);
    console.log('ICO文件已创建: public/app-icon.ico');
  })
  .catch(err => {
    console.error('转换失败:', err);
  });