import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Tab Pages
import Chats from './pages/tabs/Chats';
import Contacts from './pages/tabs/Contacts';
import Discover from './pages/tabs/Discover';
import Me from './pages/tabs/Me';

// Other Pages
import CreateContact from './pages/CreateContact';
import ChatDetail from './pages/ChatDetail';
import Settings from './pages/Settings';
import Wallet from './pages/Wallet';
import UserMasks from './pages/UserMasks';

// Components
import { TabBar } from './components/TabBar';

import ChatStyling from './pages/ChatStyling';

// Style Injector Component
function ChatStyleInjector() {
  useEffect(() => {
    const updateStyle = () => {
      const css = localStorage.getItem('chat-custom-css') || '';
      const styleId = 'chat-custom-style';
      let styleTag = document.getElementById(styleId);
      
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      
      styleTag.textContent = css;
    };

    // Initial load
    updateStyle();

    // Listen for updates
    window.addEventListener('chat-style-updated', updateStyle);
    
    return () => {
      window.removeEventListener('chat-style-updated', updateStyle);
      // Optional: Cleanup style on unmount if we want isolation
      // const styleTag = document.getElementById('chat-custom-style');
      // if (styleTag) document.head.removeChild(styleTag);
    };
  }, []);

  return null;
}

function Layout() {
  return (
    <div className="flex flex-col h-full w-full bg-[#ededed]/90 backdrop-blur-md">
      <ChatStyleInjector />
      <div className="flex-1 overflow-hidden relative pt-[54px]">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}

export default function ChatApp() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Tab Routes with TabBar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="chats" replace />} />
          <Route 
            path="chats" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                <Chats />
              </motion.div>
            } 
          />
          <Route 
            path="contacts" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                <Contacts />
              </motion.div>
            } 
          />
          <Route 
            path="discover" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                <Discover />
              </motion.div>
            } 
          />
          <Route 
            path="me" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                <Me />
              </motion.div>
            } 
          />
        </Route>

        {/* Fullscreen Routes (No TabBar) */}
        <Route 
          path="create-contact" 
          element={
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full z-50 pt-[54px] bg-[#ededed]"
            >
              <CreateContact />
            </motion.div>
          } 
        />
        <Route 
          path="chat-detail/:sessionId" 
          element={
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full z-50 pt-[54px] bg-[#ededed]"
            >
              <ChatDetail />
            </motion.div>
          } 
        />
        <Route 
          path="settings" 
          element={
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full z-50 pt-[54px] bg-[#ededed]"
            >
              <Settings />
            </motion.div>
          } 
        />
        <Route 
          path="wallet" 
          element={
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full z-50 pt-[54px] bg-[#ededed]"
            >
              <Wallet />
            </motion.div>
          } 
        />
        <Route 
          path="user-masks" 
          element={
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full z-50 pt-[54px] bg-[#ededed]"
            >
              <UserMasks />
            </motion.div>
          } 
        />
        <Route 
          path="styling" 
          element={
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full z-50 pt-[54px] bg-[#ededed]"
            >
              <ChatStyling />
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}
