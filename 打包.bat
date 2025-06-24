@echo off
chcp 65001
echo 开始打包水印工具...

:: 确保已经生成了最新的构建
call npm run build

echo 正在构建可执行文件...
call npm run electron:package

echo 完成！可执行文件已生成在 release 目录中。
echo 按任意键打开文件夹...
pause

explorer release 