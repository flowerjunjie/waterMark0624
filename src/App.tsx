import React, { useState, useEffect } from 'react';
import { HelpCircle, Github, Code } from 'lucide-react';
import WatermarkTool from '@/features/watermark/components/WatermarkTool';
import HelpDialog from '@/components/HelpDialog';
import { Button } from '@/components/ui/button';

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [version, setVersion] = useState('1.0.0');
  
  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 按下H键显示/隐藏帮助
      if (e.key === 'h' || e.key === 'H') {
        setShowHelp(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部标题栏 */}
      <header className="bg-primary text-primary-foreground py-2 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/favicon.ico" alt="水印工具" className="w-6 h-6" />
            <h1 className="text-xl font-bold">水印工具</h1>
            <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded-full">
              v{version}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setShowHelp(true)}
            >
              <HelpCircle className="h-5 w-5 mr-1" />
              帮助
            </Button>
          </div>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <div className="flex-1">
        <WatermarkTool />
      </div>
      
      {/* 底部状态栏 */}
      <footer className="bg-muted text-muted-foreground py-1 px-4 text-xs border-t">
        <div className="container mx-auto flex justify-between">
          <div>水印工具 v{version} | Copyright © {new Date().getFullYear()}</div>
          <div className="flex items-center gap-2">
            <span>按下 H 键显示帮助</span>
          </div>
        </div>
      </footer>
      
      {/* 帮助对话框 */}
      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;