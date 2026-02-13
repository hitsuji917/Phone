import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';

interface StatusBarProps {
  onControlCenterClick: () => void;
}

export default function StatusBar({ onControlCenterClick }: StatusBarProps) {
  const [time, setTime] = useState(new Date());
  const { showStatusBar } = useOSStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`w-full h-[max(24px,env(safe-area-inset-top))] px-6 pt-1 flex items-center justify-between text-white/90 font-medium text-xs relative z-50 mix-blend-difference transition-opacity duration-300 ${showStatusBar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
    >
      {/* Left: Time */}
      <div className="w-20">
        <span>{formatTime(time)}</span>
      </div>

      {/* Right: Status Icons */}
      <div 
        className="flex items-center gap-2 cursor-pointer active:opacity-60 transition-opacity"
        onClick={onControlCenterClick}
      >
        <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
        
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold">100%</span>
          <div className="relative">
             <Battery className="w-5 h-5" strokeWidth={2} />
             <div 
                className="absolute top-1.5 left-0.5 h-2 bg-current rounded-[1px] transition-all duration-300" 
                style={{ 
                  width: `13.5px`,
                  backgroundColor: 'currentColor'
                }} 
             />
          </div>
        </div>
      </div>
    </div>
  );
}
