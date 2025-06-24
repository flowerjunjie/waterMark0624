import React from 'react';

const WatermarkTool: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="grid gap-6">
        {/* 图片上传区域 */}
        <section className="bg-card rounded-lg border shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">上传图片</h2>
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex flex-col items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <line x1="16" y1="5" x2="22" y2="5"></line>
                <line x1="19" y1="2" x2="19" y2="8"></line>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">点击上传或拖放图片至此处</p>
                <p className="text-xs text-muted-foreground">支持 JPG、PNG、GIF 格式，最大 10MB</p>
              </div>
              <input type="file" multiple accept="image/*" className="hidden" />
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                选择文件
              </button>
            </div>
          </div>
        </section>

        {/* 水印设置 */}
        <section className="bg-card rounded-lg border shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">水印设置</h2>
          <p className="text-sm text-muted-foreground mb-4">请先上传图片，然后设置水印参数</p>
          <div className="flex justify-center items-center h-60 bg-muted rounded-md">
            <p className="text-muted-foreground">水印预览区域</p>
          </div>
        </section>

        {/* 导出选项 */}
        <section className="bg-card rounded-lg border shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">导出选项</h2>
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">格式</span>
              <select className="bg-background border rounded-md px-3 py-1 text-sm">
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="gif">GIF</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">质量</span>
              <input
                type="range"
                min="1"
                max="100"
                defaultValue="85"
                className="w-40"
              />
            </div>
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full mt-2">
              导出水印图片
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WatermarkTool; 