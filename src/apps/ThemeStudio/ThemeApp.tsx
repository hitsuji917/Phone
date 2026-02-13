import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Image as ImageIcon, Type, LayoutGrid, Upload, RefreshCw, X, Eye } from 'lucide-react';
import { useOSStore, DEFAULT_APPS } from '../../store/useOSStore';

export default function ThemeApp() {
  const navigate = useNavigate();
  const { 
    wallpaper, setWallpaper, 
    customIcons, setCustomIcon,
    fontUrl, fontFamily, setFont,
    resetTheme,
    showStatusBar, toggleStatusBar
  } = useOSStore();

  const [activeTab, setActiveTab] = useState<'wallpaper' | 'icons' | 'font' | 'appearance'>('wallpaper');
  
  // Wallpaper State
  const [wallpaperUrl, setWallpaperUrl] = useState(wallpaper);

  // Font State
  const [tempFontUrl, setTempFontUrl] = useState(fontUrl);
  const [tempFontFamily, setTempFontFamily] = useState(fontFamily);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'wallpaper' | 'icon', appId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'wallpaper') {
          setWallpaper(result);
          setWallpaperUrl(result);
        } else if (type === 'icon' && appId) {
          setCustomIcon(appId, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFont = () => {
    if (tempFontUrl && tempFontFamily) {
      setFont(tempFontUrl, tempFontFamily);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f2f2f7]/90 backdrop-blur-md safe-area-inset-bottom pt-[54px]">
      {/* Header */}
      <header className="flex-none bg-white/80 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-4 sticky top-0 z-10">
        <button 
          onClick={() => navigate('/')}
          className="text-[#007aff] flex items-center -ml-2 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[17px]">返回</span>
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900">美化</h1>
        <button 
          onClick={resetTheme}
          className="text-[#007aff] text-sm font-medium"
        >
          恢复默认
        </button>
      </header>

      {/* Tabs */}
      <div className="flex p-4 gap-4">
        {[
          { id: 'wallpaper', label: '壁纸', icon: ImageIcon },
          { id: 'icons', label: '图标', icon: LayoutGrid },
          { id: 'font', label: '字体', icon: Type },
          { id: 'appearance', label: '外观', icon: Eye },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-[#007aff] shadow-sm scale-105' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Wallpaper Section */}
        {activeTab === 'wallpaper' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-3">当前壁纸预览</h3>
              <div 
                className="w-full aspect-[9/16] rounded-lg bg-cover bg-center shadow-inner border border-gray-100"
                style={{ backgroundImage: `url(${wallpaper})` }}
              />
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-900 mb-2">网络图片 URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wallpaperUrl}
                    onChange={(e) => setWallpaperUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#007aff]"
                  />
                  <button 
                    onClick={() => setWallpaper(wallpaperUrl)}
                    className="bg-[#007aff] text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    应用
                  </button>
                </div>
              </div>
              <label className="flex items-center justify-center gap-2 w-full p-4 text-[#007aff] font-medium active:bg-gray-50 cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>从相册上传</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'wallpaper')} />
              </label>
            </div>
          </div>
        )}

        {/* Icons Section */}
        {activeTab === 'icons' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              {DEFAULT_APPS.map((app) => (
                <div key={app.id} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
                  <div 
                    className="w-12 h-12 rounded-xl bg-gray-100 bg-cover bg-center border border-gray-200"
                    style={{ 
                      backgroundImage: customIcons[app.id] ? `url(${customIcons[app.id]})` : 'none',
                    }}
                  >
                     {!customIcons[app.id] && (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          {app.name[0]}
                        </div>
                     )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{app.name}</h4>
                    <p className="text-xs text-gray-400">点击右侧上传替换</p>
                  </div>
                  <label className="p-2 text-[#007aff] active:opacity-60 cursor-pointer">
                    <Upload className="w-5 h-5" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'icon', app.id)} />
                  </label>
                  {customIcons[app.id] && (
                    <button 
                      onClick={() => setCustomIcon(app.id, '')}
                      className="p-2 text-red-500 active:opacity-60"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Font Section */}
        {activeTab === 'font' && (
          <div className="space-y-4 animate-in fade-in duration-300">
             <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-3">当前字体预览</h3>
              <p className="text-2xl text-center py-4" style={{ fontFamily: fontFamily || 'inherit' }}>
                Hello World<br/>
                你好世界
              </p>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">WebFont URL (CSS 链接)</label>
                <input
                  type="text"
                  value={tempFontUrl}
                  onChange={(e) => setTempFontUrl(e.target.value)}
                  placeholder="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
                  className="w-full bg-gray-50 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#007aff]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Font Family Name</label>
                <input
                  type="text"
                  value={tempFontFamily}
                  onChange={(e) => setTempFontFamily(e.target.value)}
                  placeholder="例如: 'Roboto', sans-serif"
                  className="w-full bg-gray-50 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#007aff]"
                />
              </div>
              <button 
                onClick={handleSaveFont}
                disabled={!tempFontUrl || !tempFontFamily}
                className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                  !tempFontUrl || !tempFontFamily
                    ? 'bg-gray-300' 
                    : 'bg-[#007aff] active:bg-[#0066d6]'
                }`}
              >
                应用字体
              </button>
              
              <div className="pt-2">
                 <p className="text-xs text-gray-400 mb-1">示例 (Google Fonts):</p>
                 <div className="bg-gray-50 p-2 rounded text-[10px] text-gray-500 font-mono break-all">
                   URL: https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap
                   <br/>
                   Family: "Ma Shan Zheng", cursive
                 </div>
              </div>
            </div>
          </div>
        )}
        {/* Appearance Section */}
        {activeTab === 'appearance' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">显示状态栏图标</h4>
                  <p className="text-xs text-gray-400 mt-0.5">隐藏顶部的时间、电量和信号图标</p>
                </div>
                <button 
                  onClick={() => toggleStatusBar(!showStatusBar)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    showStatusBar ? 'bg-[#34c759]' : 'bg-gray-200'
                  }`}
                >
                  <div 
                    className={`absolute top-1 bottom-1 w-5 bg-white rounded-full shadow-sm transition-transform ${
                      showStatusBar ? 'left-6' : 'left-1'
                    }`} 
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
