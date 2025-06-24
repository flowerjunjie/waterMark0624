@echo off
chcp 65001
echo 启动开发环境...

:: 检查并安装所需依赖
echo 检查并安装依赖...
call npm install class-variance-authority --save
call npm install lucide-react --save
call npm install clsx --save
call npm install tailwind-merge --save

:: 清理Vite缓存并启动开发服务器
echo 清理缓存并启动开发服务器...
call npx vite --force

:: 启动开发服务器
call npm run electron:dev

pause

echo 开发服务器已启动，按 Ctrl+C 退出。 