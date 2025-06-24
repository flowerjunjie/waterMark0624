@echo off
chcp 65001
echo 开始复制UI组件文件...

:: 创建必要的目录结构
mkdir src\components\ui 2>nul

:: 复制UI组件
echo 复制UI组件...
copy /Y "..\waterMark0624\src\components\ui\button.tsx" "src\components\ui\"
copy /Y "..\waterMark0624\src\components\ui\card.tsx" "src\components\ui\"
copy /Y "..\waterMark0624\src\components\ui\input.tsx" "src\components\ui\"
copy /Y "..\waterMark0624\src\components\ui\label.tsx" "src\components\ui\"
copy /Y "..\waterMark0624\src\components\ui\progress.tsx" "src\components\ui\"
copy /Y "..\waterMark0624\src\components\ui\select.tsx" "src\components\ui\"
copy /Y "..\waterMark0624\src\components\ui\slider.tsx" "src\components\ui\"
copy /Y "..\waterMark0624\src\components\ui\tooltip.tsx" "src\components\ui\"

echo UI组件复制完成！
pause 