import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw, Droplet, Sparkles, Minus } from 'lucide-react';

const PRESETS = [
  {
    name: '暗黑玻璃',
    icon: Droplet,
    color: 'bg-gray-800 text-white',
    css: `.chat-container { background-color: #000 !important; }
.chat-bubble-user { background: rgba(255, 255, 255, 0.2) !important; backdrop-filter: blur(10px); color: white !important; }
.chat-bubble-ai { background: rgba(255, 255, 255, 0.1) !important; backdrop-filter: blur(10px); color: white !important; }
.chat-input { background: rgba(255, 255, 255, 0.1) !important; color: white !important; }`
  },
  {
    name: '多巴胺',
    icon: Sparkles,
    color: 'bg-gradient-to-r from-[#ff9a9e] to-[#fecfef] text-white',
    css: `.chat-container { background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%) !important; }
.chat-bubble-user { background: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%) !important; color: #444 !important; }
.chat-bubble-ai { background: white !important; color: #444 !important; }`
  },
  {
    name: '极简纯白',
    icon: Minus,
    color: 'bg-white text-gray-900 border border-gray-200',
    css: '' // Empty string resets to default
  }
];

export default function ChatStyling() {
  const navigate = useNavigate();
  const [cssCode, setCssCode] = useState('');

  useEffect(() => {
    const savedCss = localStorage.getItem('chat-custom-css') || '';
    setCssCode(savedCss);
  }, []);

  const handleSave = (codeToSave?: string) => {
    const finalCode = codeToSave !== undefined ? codeToSave : cssCode;
    if (finalCode) {
        localStorage.setItem('chat-custom-css', finalCode);
    } else {
        localStorage.removeItem('chat-custom-css');
    }
    setCssCode(finalCode);
    window.dispatchEvent(new Event('chat-style-updated'));
    if (codeToSave === undefined) navigate(-1); // Only navigate back on manual save
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    handleSave(preset.css);
  };

  const handleReset = () => {
    setCssCode('');
    localStorage.removeItem('chat-custom-css');
    window.dispatchEvent(new Event('chat-style-updated'));
  };

  return (
    <div className="flex flex-col h-full bg-[#f2f2f7] safe-area-inset-bottom relative pt-[54px]">
      {/* Header */}
      <header className="flex-none bg-white/80 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-4 sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#007aff] flex items-center -ml-2 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[17px]">返回</span>
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900">聊天美化</h1>
        <button 
          onClick={() => handleSave()}
          className="text-[#007aff] text-sm font-medium"
        >
          保存
        </button>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Presets */}
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl shadow-sm transition-transform active:scale-95 ${preset.color}`}
            >
              <preset.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{preset.name}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4">
          <p className="text-sm text-gray-500 mb-2">输入 CSS 代码自定义聊天界面：</p>
          <p className="text-xs text-gray-400 font-mono mb-4 bg-gray-50 p-2 rounded">
            可用类名:<br/>
            .chat-container (背景)<br/>
            .chat-bubble-user (我方气泡)<br/>
            .chat-bubble-ai (对方气泡)<br/>
            .chat-input (输入框)
          </p>
          <textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            placeholder=".chat-bubble-user { background-color: #ff0000; }"
            className="w-full h-64 font-mono text-xs bg-gray-900 text-green-400 p-3 rounded-lg outline-none resize-none"
            spellCheck={false}
          />
        </div>

        <button 
          onClick={handleReset}
          className="w-full bg-white active:bg-gray-50 text-red-500 py-3 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重置所有样式
        </button>
      </main>
    </div>
  );
}
