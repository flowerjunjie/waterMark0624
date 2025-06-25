const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建256x256的画布
const canvas = createCanvas(256, 256);
const ctx = canvas.getContext('2d');

// 绘制背景
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 256, 256);

// 绘制水印文字
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('水印', 128, 100);
ctx.fillText('工具', 128, 160);

// 保存为PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/app-icon.png', buffer);

console.log('图标已创建: public/app-icon.png');