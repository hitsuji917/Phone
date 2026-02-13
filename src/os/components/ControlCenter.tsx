import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, Bluetooth, Plane, Moon, Sun, Volume2, 
  Activity, VenetianMask, RefreshCw, X, Battery 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useOSStore } from '../../store/useOSStore';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ControlCenter({ isOpen, onClose }: ControlCenterProps) {
  const userProfile = useAppStore((state) => state.userProfile);
  const { updateDesktopLayout, desktopLayout } = useOSStore();
  
  // Fake states for visual toggle
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(60);

  const activeMask = userProfile.masks?.find(m => m.id === userProfile.activeMaskId);

  const handleResetIcons = () => {
    // Reset to default layout but keep existing apps if possible
    // For now, let's just restore the default order defined in store or a hardcoded list
    // Actually, updateDesktopLayout expects an array of IDs.
    // Let's reset to a safe default.
    updateDesktopLayout(['chat', 'theme', 'settings']);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[20px] z-[9998]"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-4 top-4 z-[9999] bg-white/10 backdrop-blur-md rounded-[30px] p-6 shadow-2xl border border-white/20 text-white overflow-hidden"
            style={{ maxHeight: '85vh' }}
          >
            {/* Header / Close handle area */}
            <div className="flex justify-center mb-6" onClick={onClose}>
              <div className="w-12 h-1.5 bg-white/30 rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Connectivity Grid */}
              <div className="bg-black/20 backdrop-blur-3xl rounded-[24px] p-4 grid grid-cols-2 gap-3 aspect-square">
                <button 
                  onClick={() => setWifi(!wifi)}
                  className={`flex items-center justify-center rounded-full transition-colors ${wifi ? 'bg-[#007aff] text-white' : 'bg-white/10 text-white'}`}
                >
                  <Wifi className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setBluetooth(!bluetooth)}
                  className={`flex items-center justify-center rounded-full transition-colors ${bluetooth ? 'bg-[#007aff] text-white' : 'bg-white/10 text-white'}`}
                >
                  <Bluetooth className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setAirplane(!airplane)}
                  className={`flex items-center justify-center rounded-full transition-colors ${airplane ? 'bg-[#ff9500] text-white' : 'bg-white/10 text-white'}`}
                >
                  <Plane className="w-5 h-5" />
                </button>
                <button className="flex items-center justify-center rounded-full bg-white/10 text-white">
                  <Activity className="w-5 h-5 text-green-400" />
                </button>
              </div>

              {/* Mask & API Status */}
              <div className="flex flex-col gap-4">
                 <div className="flex-1 bg-black/20 backdrop-blur-3xl rounded-[24px] p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-white/80">
                      <VenetianMask className="w-5 h-5" />
                      <span className="text-xs font-medium">当前面具</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold leading-tight">
                        {activeMask ? activeMask.name : '本色出演'}
                      </div>
                      <div className="text-[10px] text-white/60 mt-1 truncate">
                        {activeMask ? activeMask.description : 'Default Persona'}
                      </div>
                    </div>
                 </div>
                 <div className="h-14 bg-black/20 backdrop-blur-3xl rounded-[24px] px-4 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                    <span className="text-xs font-medium text-white/90">API 正常</span>
                    <div className="ml-auto flex items-center gap-1 text-white/60">
                        <Battery className="w-4 h-4" />
                        <span className="text-[10px]">100%</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               {/* Brightness */}
               <div className="h-32 bg-black/20 backdrop-blur-3xl rounded-[24px] relative overflow-hidden group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-white/90 transition-all"
                    style={{ height: `${brightness}%` }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 z-10 pointer-events-none mix-blend-difference text-white">
                    <Sun className="w-6 h-6" />
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
                    style={{ transform: 'rotate(-90deg)' }} 
                  />
               </div>

               {/* Volume */}
               <div className="h-32 bg-black/20 backdrop-blur-3xl rounded-[24px] relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-white/90 transition-all"
                    style={{ height: `${volume}%` }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 z-10 pointer-events-none mix-blend-difference text-white">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
                    style={{ transform: 'rotate(-90deg)' }}
                  />
               </div>
            </div>

            {/* Reset Layout Button */}
            <button 
              onClick={handleResetIcons}
              className="w-full bg-white/10 active:bg-white/20 rounded-[18px] py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重置桌面图标位置
            </button>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
