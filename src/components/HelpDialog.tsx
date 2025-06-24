import React from 'react';

interface HelpDialogProps {
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">使用帮助</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <section>
              <h3 className="text-xl font-semibold">水印工具简介</h3>
              <p>这是一个简单易用的图片水印工具，可以为图片添加文字水印、图片水印，支持批量处理。</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold">基本操作</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>上传图片：点击上传区域或拖拽图片到上传区域</li>
                <li>添加水印：选择水印类型，设置水印参数</li>
                <li>预览：调整参数后可以实时预览效果</li>
                <li>导出：点击导出按钮，选择导出格式和质量</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold">快捷键</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><kbd className="bg-muted px-2 py-1 rounded">H</kbd> - 打开/关闭帮助</li>
                <li><kbd className="bg-muted px-2 py-1 rounded">Ctrl+O</kbd> - 打开图片</li>
                <li><kbd className="bg-muted px-2 py-1 rounded">Ctrl+S</kbd> - 保存处理后的图片</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDialog; 