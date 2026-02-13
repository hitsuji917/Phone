import React from 'react';
import { Compass, Camera, ShoppingBag } from 'lucide-react';

export default function Discover() {
  return (
    <div className="flex flex-col h-full bg-[#ededed]">
      {/* Header */}
      <header className="flex-none bg-[#f9f9f9]/90 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-center px-4 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <h1 className="text-[17px] font-semibold text-gray-900">发现</h1>
      </header>

      <main className="flex-1 overflow-y-auto pt-2">
        <div className="bg-white mb-3">
          <div className="flex items-center gap-3 px-4 py-3 active:bg-gray-100">
            <Compass className="w-6 h-6 text-[#007aff]" />
            <span className="text-[16px] text-gray-900 flex-1">朋友圈</span>
          </div>
        </div>

        <div className="bg-white mb-3">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-100">
            <Camera className="w-6 h-6 text-[#ff9500]" />
            <span className="text-[16px] text-gray-900 flex-1">视频号</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 active:bg-gray-100">
            <ShoppingBag className="w-6 h-6 text-[#ff3b30]" />
            <span className="text-[16px] text-gray-900 flex-1">直播</span>
          </div>
        </div>
      </main>
    </div>
  );
}
