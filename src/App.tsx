import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useOSStore } from './store/useOSStore';

// Apps
import ChatApp from './apps/Chat/ChatApp';
import ThemeApp from './apps/ThemeStudio/ThemeApp';

// OS
import Desktop from './os/Desktop';

function GlobalStyleInjector() {
  const { fontUrl, fontFamily } = useOSStore();

  useEffect(() => {
    if (fontUrl) {
      // Inject font link
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      link.id = 'custom-font-link';
      
      // Remove old link if exists
      const oldLink = document.getElementById('custom-font-link');
      if (oldLink) {
        document.head.removeChild(oldLink);
      }
      
      document.head.appendChild(link);
    }
    
    if (fontFamily) {
      document.body.style.fontFamily = fontFamily;
    } else {
      document.body.style.fontFamily = '';
    }

    return () => {
      // Cleanup not strictly necessary as we want persistence, 
      // but good practice if unmounting completely.
    };
  }, [fontUrl, fontFamily]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        {/* Desktop (Home Screen) */}
        <Route 
          path="/" 
          element={
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }} // Zoom out effect
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <Desktop />
            </motion.div>
          } 
        />

        {/* Chat App */}
        <Route 
          path="/chat/*" 
          element={
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} // Zoom in/out effect
              transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
              className="h-full w-full bg-white"
            >
              <ChatApp />
            </motion.div>
          } 
        />

        {/* Theme App */}
        <Route 
          path="/theme/*" 
          element={
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} // Zoom in/out effect
              transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
              className="h-full w-full bg-white"
            >
              <ThemeApp />
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function WallpaperLayer() {
  const { wallpaper } = useOSStore();
  
  // Debug log
  console.log('当前壁纸数据:', wallpaper);

  const bgStyle = wallpaper ? {
    backgroundImage: `url(${wallpaper})`,
    backgroundColor: '#1a1a1a', 
  } : {
    background: 'linear-gradient(to right, #ff0000, #00ff00)', // Debug fallback
  };
  
  return (
    <div 
      className="fixed inset-0 bg-cover bg-center z-[-1]"
      style={bgStyle}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <GlobalStyleInjector />
      <WallpaperLayer />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
