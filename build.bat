@echo off
mkdir "%LOCALAPPDATA%\electron\Cache"
copy /Y "electron-v13.6.9-win32-x64.zip" "%LOCALAPPDATA%\electron\Cache\"
set ELECTRON_CACHE=%LOCALAPPDATA%\electron\Cache
set ELECTRON_SKIP_BINARY_DOWNLOAD=1
call npm run build
call npx electron-builder --win --config electron-builder.json
explorer release\win-unpacked