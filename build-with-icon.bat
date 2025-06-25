@echo off
echo 开始打包应用...

rem 复制favicon.ico到app-icon.ico
copy /Y public\favicon.ico public\app-icon.ico
echo 已复制favicon.ico到app-icon.ico

rem 修改electron-builder.json配置
powershell -Command "$json = Get-Content -Raw electron-builder.json | ConvertFrom-Json; $json.win.icon = 'public/app-icon.ico'; $json | ConvertTo-Json -Depth 10 | Set-Content electron-builder.json"
echo 已更新electron-builder.json配置

rem 修改electron.js配置
powershell -Command "(Get-Content electron.js) -replace 'icon: path.join\(__dirname, ''public/favicon.ico''\)', 'icon: path.join(__dirname, ''public/app-icon.ico'')' | Set-Content electron.js"
echo 已更新electron.js配置

rem 执行打包命令
if exist "electron-v13.6.9-win32-x64.zip" (
  echo 使用本地Electron包打包...
  if not exist "%LOCALAPPDATA%\electron\Cache" mkdir "%LOCALAPPDATA%\electron\Cache"
  copy /Y "electron-v13.6.9-win32-x64.zip" "%LOCALAPPDATA%\electron\Cache\electron-v13.6.9-win32-x64.zip"
)

call npm run build