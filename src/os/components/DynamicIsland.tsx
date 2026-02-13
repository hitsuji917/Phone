import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function DynamicIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState({ title: '系统运行正常', icon: CheckCircle2, color: 'text-green-400' });

  // Listen for styling updates to show feedback
  useEffect(() => {
    const handleStyleUpdate = () => {
      setMessage({ title: '今日美化已生效', icon: Sparkles, color: 'text-pink-400' });
      setIsExpanded(true);
      setTimeout(() => setIsExpanded(false), 3000);
    };

    window.addEventListener('chat-style-updated', handleStyleUpdate);
    return () => window.removeEventListener('chat-style-updated', handleStyleUpdate);
  }, []);

  return (
    <>
      {/* Trigger Area (Always present but invisible/subtle) */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] z-[100] cursor-pointer"
        onClick={() => setIsExpanded(true)}
      />

      {/* Expanded Card */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop to close on click outside */}
            <div 
              className="fixed inset-0 z-[99] bg-transparent"
              onClick={() => setIsExpanded(false)}
            />
            
            <motion.div
              initial={{ width: 120, height: 35, borderRadius: 20, y: 0, opacity: 0 }}
              animate={{ width: 300, height: 80, borderRadius: 24, y: 8, opacity: 1 }}
              exit={{ width: 120, height: 35, borderRadius: 20, y: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-2xl text-white z-[101] shadow-2xl flex items-center justify-center overflow-hidden origin-top"
              onClick={() => setIsExpanded(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 px-6"
              >
                <message.icon className={`w-8 h-8 ${message.color}`} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{message.title}</span>
                  <span className="text-[10px] text-white/60">MyOS Intelligence</span>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
