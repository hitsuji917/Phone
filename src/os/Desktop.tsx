import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, PanInfo } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useOSStore, DEFAULT_APPS, AppIcon } from '../store/useOSStore';
import ControlCenter from './components/ControlCenter';
import StatusBar from './components/StatusBar';

// Helper to get Icon component dynamically
const getIconComponent = (name: string) => {
  return (LucideIcons as any)[name] || LucideIcons.HelpCircle;
};

export default function Desktop() {
  const navigate = useNavigate();
  const { wallpaper, customIcons, desktopLayout, updateDesktopLayout } = useOSStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [apps, setApps] = useState<AppIcon[]>([]);

  // Initialize apps based on layout order
  useEffect(() => {
    const orderedApps = desktopLayout
      .map(id => DEFAULT_APPS.find(app => app.id === id))
      .filter(Boolean) as AppIcon[];
    
    // Add any missing apps to the end (in case DEFAULT_APPS updated)
    const missingApps = DEFAULT_APPS.filter(app => !desktopLayout.includes(app.id));
    
    setApps([...orderedApps, ...missingApps]);
  }, [desktopLayout]);

  const handleAppClick = (app: AppIcon) => {
    if (isEditing) return; // Don't open if editing
    if (app.route) {
      navigate(app.route);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, draggedAppId: string) => {
    if (!containerRef.current) return;

    // Check if dropped on Dock
    if (dockRef.current) {
        const dockRect = dockRef.current.getBoundingClientRect();
        const dropPoint = { x: info.point.x, y: info.point.y };
        
        // Simple bounding box check
        if (
            dropPoint.x >= dockRect.left && 
            dropPoint.x <= dockRect.right && 
            dropPoint.y >= dockRect.top && 
            dropPoint.y <= dockRect.bottom
        ) {
            // Rebound logic is handled by framer-motion's layout animation automatically 
            // if we don't update state.
            // But to be explicit: we do NOTHING here, so it snaps back to original position
            // because we haven't reordered the 'apps' state.
            return;
        }
    }
    
    // Grid Reordering Logic
    const elementUnderCursor = document.elementFromPoint(info.point.x, info.point.y);
    const targetItem = elementUnderCursor?.closest('[data-app-id]');
    
    if (targetItem) {
      const targetId = targetItem.getAttribute('data-app-id');
      if (targetId && targetId !== draggedAppId) {
        const oldIndex = apps.findIndex(a => a.id === draggedAppId);
        const newIndex = apps.findIndex(a => a.id === targetId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newApps = [...apps];
          const [moved] = newApps.splice(oldIndex, 1);
          newApps.splice(newIndex, 0, moved);
          
          setApps(newApps);
          updateDesktopLayout(newApps.map(a => a.id));
        }
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-hidden relative"
      onClick={() => setIsEditing(false)} // Exit edit mode on background click
    >
      {/* Control Center Overlay */}
      <ControlCenter isOpen={showControlCenter} onClose={() => setShowControlCenter(false)} />

      {/* Background Layer moved to App.tsx */}
      <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity pointer-events-none ${isEditing ? 'opacity-100' : 'opacity-0'}`} />

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <StatusBar onControlCenterClick={() => setShowControlCenter(true)} />
      </div>

      {/* Invisible Control Center Trigger (When StatusBar is hidden) */}
      <div 
        className="absolute top-0 left-0 right-0 h-[40px] z-40 pointer-events-auto"
        onClick={() => setShowControlCenter(true)} 
      />

      {/* App Grid */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-8 p-6 pt-[54px] relative z-10 px-8">
        
        {apps.map((app) => {
          const IconComponent = getIconComponent(app.iconValue);
          const customIcon = customIcons[app.id];
          
          return (
            <motion.div
              key={app.id}
              layout // Animate layout changes
              data-app-id={app.id}
              className="flex flex-col items-center gap-2 relative group"
              drag={isEditing} // Only draggable when editing
              dragConstraints={containerRef}
              dragElastic={0.1}
              whileDrag={{ scale: 1.2, zIndex: 100 }} // Ensure high z-index when dragging
              onDragEnd={(e, info) => handleDragEnd(e, info, app.id)}
              onLongPress={() => {}}
              // Using onPointerDown/Up for long press simulation
              onPointerDown={() => {
                const timer = setTimeout(() => setIsEditing(true), 500);
                (window as any)._longPressTimer = timer;
              }}
              onPointerUp={() => {
                if ((window as any)._longPressTimer) clearTimeout((window as any)._longPressTimer);
              }}
              onPointerMove={() => {
                 if ((window as any)._longPressTimer) clearTimeout((window as any)._longPressTimer);
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAppClick(app);
                }}
                className={`relative transition-transform ${isEditing ? 'animate-wobble' : ''}`}
              >
                {/* Delete Badge (Visual only for now) */}
                {isEditing && !app.isSystem && (
                  <div className="absolute -top-2 -left-2 w-5 h-5 bg-gray-400/80 rounded-full flex items-center justify-center text-white z-20">
                    <span className="text-xs font-bold">-</span>
                  </div>
                )}

                <div className="w-[60px] h-[60px] bg-white rounded-[14px] flex items-center justify-center shadow-lg relative overflow-hidden group-active:scale-95 transition-transform duration-100">
                   {customIcon ? (
                     <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${customIcon})` }}
                     />
                   ) : (
                     <>
                       <div className={`absolute inset-0 bg-gradient-to-br ${
                         app.id === 'chat' ? 'from-[#07c160] to-[#05a050]' : 
                         app.id === 'theme' ? 'from-[#007aff] to-[#0055ff]' :
                         'from-gray-100 to-gray-200'
                       }`}></div>
                       {app.iconType === 'lucide' && (
                         <IconComponent className={`w-8 h-8 ${
                            ['chat', 'theme'].includes(app.id) ? 'text-white' : 'text-gray-500'
                         } relative z-10`} fill={['chat', 'theme'].includes(app.id) ? 'currentColor' : 'none'} />
                       )}
                     </>
                   )}
                </div>
              </button>
              <span className="text-white text-xs font-medium drop-shadow-md text-center leading-tight">
                {app.name}
              </span>
            </motion.div>
          );
        })}

      </div>

      {/* Dock */}
      <div 
        ref={dockRef}
        className="absolute bottom-4 left-4 right-4 h-24 bg-white/20 backdrop-blur-xl rounded-[30px] flex items-center justify-around px-4 mb-[env(safe-area-inset-bottom)] z-0 pointer-events-none"
      >
         {/* Dock Icons Placeholder - Fixed for now */}
         <div className="w-[50px] h-[50px] bg-[#34c759] rounded-[12px] shadow-sm pointer-events-auto"></div>
         <div className="w-[50px] h-[50px] bg-[#007aff] rounded-[12px] shadow-sm pointer-events-auto"></div>
         <div className="w-[50px] h-[50px] bg-[#ff9500] rounded-[12px] shadow-sm pointer-events-auto"></div>
         <div className="w-[50px] h-[50px] bg-[#ff3b30] rounded-[12px] shadow-sm pointer-events-auto"></div>
      </div>

      <style>{`
        @keyframes wobble {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wobble {
          animation: wobble 0.3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
