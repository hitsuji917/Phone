import React, { useRef } from 'react';
import { Camera, Image, Link as LinkIcon, Upload, X } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (avatar: string) => void;
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
  name?: string;
}

const AVATAR_COLORS = [
  '#007aff', '#ff3b30', '#4cd964', '#ffcc00', '#5856d6', '#ff9500', '#8e8e93', '#ff2d55'
];

export function AvatarSelector({ currentAvatar, onSelect, selectedColor, onColorSelect, name }: AvatarSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState('');
  const [showUrlInput, setShowUrlInput] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Here we should compress the image in a real app, 
        // but for now we just use the base64 string directly.
        // Be careful with large images filling up localStorage.
        onSelect(reader.result as string);
        setShowMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onSelect(urlInput.trim());
      setShowUrlInput(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        onClick={() => setShowMenu(true)}
        className="w-20 h-20 rounded-xl shadow-md flex items-center justify-center text-white text-3xl font-medium transition-colors cursor-pointer overflow-hidden relative group"
        style={{ 
          backgroundColor: currentAvatar.startsWith('http') || currentAvatar.startsWith('data:') ? 'transparent' : (currentAvatar || selectedColor || '#ccc'),
          backgroundImage: (currentAvatar.startsWith('http') || currentAvatar.startsWith('data:')) ? `url(${currentAvatar})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {(!currentAvatar.startsWith('http') && !currentAvatar.startsWith('data:')) && (name ? name[0] : <Camera className="w-8 h-8 opacity-50" />)}
        
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>

      {onColorSelect && (
        <div className="flex gap-2 overflow-x-auto w-full justify-center px-2 py-1 no-scrollbar">
          {AVATAR_COLORS.map(color => (
            <button
              key={color}
              onClick={() => {
                onColorSelect(color);
                onSelect(color); // Also set avatar to color
              }}
              className={`w-8 h-8 rounded-full border-2 shrink-0 transition-transform ${
                selectedColor === color && !currentAvatar.startsWith('http') && !currentAvatar.startsWith('data:') ? 'border-gray-400 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Action Sheet */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowMenu(false)}>
          <div className="bg-[#f7f7f7] w-full max-w-sm sm:mb-4 sm:rounded-xl rounded-t-xl overflow-hidden shadow-xl animate-in slide-in-from-bottom duration-200" onClick={e => e.stopPropagation()}>
            <div className="bg-white/80 backdrop-blur-md mb-2 rounded-t-xl overflow-hidden">
               <div className="py-3 text-center text-xs text-gray-500 border-b border-gray-200">
                更换头像
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 text-[17px] text-[#007aff] bg-white active:bg-gray-50 border-b border-gray-200 flex items-center justify-center gap-2"
              >
                <Image className="w-5 h-5" />
                从相册选择
              </button>
              
              <button 
                onClick={() => { setShowUrlInput(true); setShowMenu(false); }}
                className="w-full py-3.5 text-[17px] text-[#007aff] bg-white active:bg-gray-50 flex items-center justify-center gap-2"
              >
                <LinkIcon className="w-5 h-5" />
                使用网络图片
              </button>
            </div>

            <button 
              onClick={() => setShowMenu(false)}
              className="w-full py-3.5 text-[17px] font-semibold text-[#007aff] bg-white rounded-b-xl sm:rounded-xl active:bg-gray-50"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* URL Input Modal */}
      {showUrlInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xs rounded-xl p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">输入图片链接</h3>
            <input 
              type="text" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full bg-gray-100 p-2 rounded-lg mb-4 text-sm outline-none focus:ring-2 focus:ring-[#007aff]"
              autoFocus
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setShowUrlInput(false)}
                className="flex-1 py-2 text-gray-500 font-medium"
              >
                取消
              </button>
              <button 
                onClick={handleUrlSubmit}
                className="flex-1 py-2 bg-[#007aff] text-white rounded-lg font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
