@echo off
chcp 65001 > nul
echo 开始打包水印工具...

:: 首先确保图标是正确的格式
echo 正在处理应用图标...
node create-large-icon.js

:: 确保已经生成了最新的构建
call npm run build

echo 正在构建可执行文件...
call npm run electron:package

echo 完成！可执行文件已生成在 release 目录中。
echo Press any key to open the folder...
pause

explorer release
