@echo off
chcp 65001
echo 开始降级依赖安装...

:: 临时安装低版本依赖
call npm install electron@13.6.9 --save-dev
call npm install electron-builder@22.14.13 --save-dev

echo 开始构建和打包...

:: 构建React应用
call npm run build

:: 使用electron-builder打包
call npm run electron:package

echo 完成！可执行文件已生成在 release 目录中。
echo 按任意键打开文件夹...
pause

explorer release 