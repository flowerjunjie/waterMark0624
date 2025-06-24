@echo off
chcp 65001

:: 请求管理员权限
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo 请求管理员权限...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

echo 开始打包水印工具...

:: 检查并安装所需依赖
echo 检查并安装依赖...
call npm install class-variance-authority --save
call npm install lucide-react --save
call npm install clsx --save
call npm install tailwind-merge --save

:: 使用npx执行vite构建
echo 正在构建项目...
call npx vite build --debug

echo 正在构建可执行文件...
call npm run electron:package

echo 完成！可执行文件已生成在 release 目录中。
echo 按任意键打开文件夹...
pause

explorer release 