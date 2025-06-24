@echo off
chcp 65001
echo 开始从原始项目恢复文件...

:: 删除当前src目录下所有文件（保留目录结构）
echo 清理当前src目录...
del /S /Q src\*.*

:: 创建必要的目录结构
echo 创建目录结构...
mkdir src\components\ui 2>nul
mkdir src\features\watermark\components 2>nul
mkdir src\features\watermark\hooks 2>nul
mkdir src\features\watermark\utils 2>nul
mkdir src\features\watermark\types 2>nul
mkdir src\utils 2>nul
mkdir src\hooks 2>nul
mkdir src\lib 2>nul
mkdir src\types 2>nul

:: 复制src下的主要文件
echo 复制主要文件...
copy /Y "..\waterMark0624\src\App.tsx" "src\"
copy /Y "..\waterMark0624\src\index.css" "src\"
copy /Y "..\waterMark0624\src\main.tsx" "src\"

:: 复制components目录
echo 复制组件文件...
copy /Y "..\waterMark0624\src\components\*.tsx" "src\components\"
copy /Y "..\waterMark0624\src\components\ui\*.tsx" "src\components\ui\"

:: 复制features/watermark/components目录
echo 复制watermark组件文件...
copy /Y "..\waterMark0624\src\features\watermark\components\*.tsx" "src\features\watermark\components\"

:: 复制hooks目录
echo 复制watermark hooks文件...
copy /Y "..\waterMark0624\src\features\watermark\hooks\*.ts" "src\features\watermark\hooks\"

:: 复制utils目录
echo 复制watermark utils文件...
copy /Y "..\waterMark0624\src\features\watermark\utils\*.ts" "src\features\watermark\utils\"

:: 复制types目录
echo 复制watermark types文件...
copy /Y "..\waterMark0624\src\features\watermark\types\*.ts" "src\features\watermark\types\"

:: 复制lib目录
echo 复制lib文件...
copy /Y "..\waterMark0624\src\lib\*.ts" "src\lib\"

:: 复制types目录
echo 复制types文件...
copy /Y "..\waterMark0624\src\types\*.ts" "src\types\"

echo 文件恢复完成！
pause 