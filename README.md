# 水印工具

一个功能强大的图片水印添加工具，可以为图片添加文字或图片水印。

## 特性

- 支持多种图片格式（PNG, JPG, WEBP, GIF）
- 支持文字水印和图片水印
- 支持平铺水印模式
- 拖放式图片上传，支持批量处理
- 自定义水印位置、大小、透明度和旋转角度
- 直观的拖拽界面和鼠标滚轮控制
- 批量处理多张图片
- 保留原始图片结构的批量下载

## 安装与运行

### 使用已打包的可执行程序

1. 从发布页面下载最新版本的可执行程序
2. 解压后双击 `水印工具.exe` 即可运行，无需安装

### 从源码运行

1. 克隆仓库
2. 安装依赖：`npm install`
3. 开发模式运行：`npm run dev`
4. 构建：`npm run build`
5. 打包为可执行程序：`打包.bat`

## 打包说明

### 便携版打包

运行 `打包.bat` 脚本，将在 `release` 目录生成便携版可执行程序。

### 管理员权限打包

如果普通打包出现权限问题，可以使用 `管理员打包.bat`，以管理员权限运行打包脚本。

### 降级打包

如果最新版本的Electron打包出现问题，可以尝试 `降级打包.bat`，使用较低版本的Electron和electron-builder。

## 使用方法

![水印工具界面](public/screenshot.png)

1. **上传图片**：拖放图片到上传区或点击"选择图片"按钮
2. **选择水印类型**：
   - 文字水印：输入文本、选择字体大小和颜色
   - 图片水印：上传水印图片、调整大小
   - 平铺水印：设置水印平铺间距
3. **调整水印设置**：
   - 不透明度：控制水印的透明度
   - 位置：选择预设位置或自定义位置
   - 旋转：设置水印的旋转角度
4. **自定义定位**：
   - 直接拖动：在预览区拖动水印调整位置
   - 鼠标滚轮：调整水印大小
5. **批量处理**：
   - 点击"应用到所有"将当前水印设置应用到所有图片
   - 点击"批量下载"下载所有处理后的图片

## 键盘快捷键

- **H**: 显示/隐藏帮助
- **Ctrl+O**: 打开文件选择对话框
- **Delete**: 删除当前选中图片
- **+/-**: 放大/缩小预览

## 常见问题

1. **问题**: 水印不显示或位置不正确
   **解决**: 点击"显示水印"选项，确保已开启水印显示

2. **问题**: 处理GIF图片时速度慢
   **解决**: GIF处理需要对每一帧添加水印，会比较耗时，请耐心等待

3. **问题**: 水印效果不明显
   **解决**: 调整水印的不透明度、大小或颜色，使水印更加明显

4. **问题**: 打包过程中遇到网络问题
   **解决**: 已配置国内镜像源，但如果仍有问题，可尝试使用VPN或降级打包脚本

## 技术栈

- React + TypeScript
- Tailwind CSS - 样式工具
- Vite - 构建工具
- shadcn/ui - UI组件库基础
- gif.js - GIF处理
- jszip - 打包下载
- Electron - 桌面应用打包

## 项目结构

```
src/
  components/             - 通用UI组件
    ui/                   - shadcn/ui组件
    ColorPicker.tsx       - 颜色选择器组件
    Dropzone.tsx          - 文件拖放区组件
    HelpDialog.tsx        - 帮助对话框组件
  features/               - 功能模块
    watermark/            - 水印功能模块
      components/         - 水印相关组件
        WatermarkTool.tsx          - 主水印工具组件
        WatermarkSettingsPanel.tsx - 水印设置面板
        TextWatermarkSettings.tsx  - 文字水印设置
        ImageWatermarkSettings.tsx - 图片水印设置
        TiledWatermarkSettings.tsx - 平铺水印设置
        ImagePreview.tsx           - 图片预览
        ImageList.tsx              - 图片列表
        FileUploader.tsx           - 文件上传
        BatchActions.tsx           - 批量操作
      hooks/              - 水印相关自定义钩子
        useImageManager.ts         - 图片管理
        useWatermarkSettings.ts    - 水印设置
        useWatermarkApplier.ts     - 水印应用
        useWatermarkDrag.ts        - 水印拖动
        usePreviewZoom.ts          - 预览缩放
        useWatermarkOverlay.ts     - 水印覆盖层
      types/              - 水印相关类型定义
      utils/              - 水印相关工具函数
```

## 开发

本项目使用React, TypeScript和Vite开发。

### 开发环境设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 打包为可执行程序
npm run pkg

# 调试运行
npm run server
```

## 项目架构

该项目采用了现代化的React架构，遵循单一职责原则，将功能模块化：

```
src/
  components/             - 通用UI组件
    ui/                   - shadcn/ui组件
    ColorPicker.tsx       - 颜色选择器组件
    Dropzone.tsx          - 文件拖放区组件
  features/               - 功能模块
    watermark/            - 水印功能模块
      components/         - 水印相关组件
        WatermarkTool.tsx          - 主水印工具组件
        WatermarkSettingsPanel.tsx - 水印设置面板
        TextWatermarkSettings.tsx  - 文字水印设置
        ImageWatermarkSettings.tsx - 图片水印设置
        TiledWatermarkSettings.tsx - 平铺水印设置
        ImagePreview.tsx           - 图片预览
        ImageList.tsx              - 图片列表
        FileUploader.tsx           - 文件上传
        BatchActions.tsx           - 批量操作
      hooks/              - 水印相关自定义钩子
        useImageManager.ts         - 图片管理
        useWatermarkSettings.ts    - 水印设置
        useWatermarkApplier.ts     - 水印应用
        useWatermarkDrag.ts        - 水印拖动
        usePreviewZoom.ts          - 预览缩放
        useWatermarkOverlay.ts     - 水印覆盖层
      types/              - 水印相关类型定义
        index.ts                   - 定义ImageFile和WatermarkSettings等类型
      utils/              - 水印相关工具函数
        applyWatermark.ts          - 获取水印尺寸
        watermarkPosition.ts       - 获取水印位置
        applyWatermarkToGif.ts     - 给GIF添加水印
        applyWatermarkToImage.ts   - 给普通图片添加水印
        tiledWatermark.ts          - 平铺水印绘制
        downloadUtils.ts           - 下载工具
  lib/                   - 工具库
    utils.ts             - 工具函数
  App.tsx                - 应用入口
  main.tsx               - 渲染入口
```

## 架构改进

相比于原始代码：

1. **单一职责原则**: 每个组件和钩子都有明确的职责
2. **关注点分离**: UI组件和业务逻辑分离
3. **可维护性**: 小型、专注的文件更容易维护
4. **可扩展性**: 模块化设计让添加新功能更容易
5. **可测试性**: 逻辑分离让单元测试更简单
6. **可复用性**: 通用组件和钩子可在其他地方复用