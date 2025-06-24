@echo off
chcp 65001
echo 开始从原始项目恢复文件...

:: 删除当前src目录下所有文件（保留目录结构）
echo 清理当前src目录...
del /S /Q src\*.*

:: 创建必要的目录结构
echo 创建目录结构...
mkdir src\components 2>nul
mkdir src\features\watermark\components 2>nul
mkdir src\features\watermark\hooks 2>nul
mkdir src\features\watermark\utils 2>nul
mkdir src\utils 2>nul
mkdir src\hooks 2>nul
mkdir src\lib 2>nul
mkdir src\types 2>nul

:: 复制src下的主要文件
echo 复制主要文件...
copy /Y "..\waterMark0624\src\App.tsx" "src\"
copy /Y "..\waterMark0624\src\index.css" "src\"
copy /Y "..\waterMark0624\src\main.tsx" "src\"

:: 复制组件文件
echo 复制组件文件...
xcopy /Y /E "..\waterMark0624\src\components\*.*" "src\components\"

:: 复制features文件
echo 复制features文件...
xcopy /Y /E "..\waterMark0624\src\features\*.*" "src\features\"

:: 复制utils文件
echo 复制utils文件...
xcopy /Y /E "..\waterMark0624\src\utils\*.*" "src\utils\"

:: 复制hooks文件
echo 复制hooks文件...
xcopy /Y /E "..\waterMark0624\src\hooks\*.*" "src\hooks\"

:: 复制lib文件
echo 复制lib文件...
xcopy /Y /E "..\waterMark0624\src\lib\*.*" "src\lib\"

:: 复制types文件
echo 复制types文件...
xcopy /Y /E "..\waterMark0624\src\types\*.*" "src\types\"

echo 文件恢复完成！
pause 