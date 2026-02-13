import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AppIcon {
  id: string;
  name: string;
  iconType: 'lucide' | 'image';
  iconValue: string; // Lucide icon name or Image URL
  route: string;
  isSystem?: boolean;
}

interface OSState {
  wallpaper: string;
  customIcons: Record<string, string>; // appId -> imageUrl
  fontUrl: string;
  fontFamily: string;
  desktopLayout: string[]; // Array of app IDs in order
  showStatusBar: boolean;
  
  // Actions
  setWallpaper: (url: string) => void;
  setCustomIcon: (appId: string, url: string) => void;
  setFont: (url: string, family: string) => void;
  updateDesktopLayout: (newLayout: string[]) => void;
  toggleStatusBar: (show: boolean) => void;
  resetTheme: () => void;
}

export const DEFAULT_APPS: AppIcon[] = [
  { id: 'chat', name: 'Chat', iconType: 'lucide', iconValue: 'MessageSquare', route: '/chat/chats', isSystem: true },
  { id: 'theme', name: '美化', iconType: 'lucide', iconValue: 'Palette', route: '/theme', isSystem: true },
  { id: 'settings', name: '设置', iconType: 'lucide', iconValue: 'Settings', route: '/chat/settings', isSystem: false },
];

export const useOSStore = create<OSState>()(
  persist(
    (set) => ({
      wallpaper: 'https://images.unsplash.com/photo-1695514675039-4172f8832573?q=80&w=2564&auto=format&fit=crop',
      customIcons: {},
      fontUrl: '',
      fontFamily: '',
      desktopLayout: ['chat', 'theme', 'settings'],
      showStatusBar: true,

      setWallpaper: (url) => set({ wallpaper: url }),
      setCustomIcon: (appId, url) => set((state) => ({
        customIcons: { ...state.customIcons, [appId]: url }
      })),
      setFont: (url, family) => set({ fontUrl: url, fontFamily: family }),
      updateDesktopLayout: (newLayout) => set({ desktopLayout: newLayout }),
      toggleStatusBar: (show) => set({ showStatusBar: show }),
      resetTheme: () => set({
        wallpaper: 'https://images.unsplash.com/photo-1695514675039-4172f8832573?q=80&w=2564&auto=format&fit=crop',
        customIcons: {},
        fontUrl: '',
        fontFamily: '',
        desktopLayout: ['chat', 'theme', 'settings'],
        showStatusBar: true
      })
    }),
    {
      name: 'os-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: any, version) => {
        if (version < 2) {
          return {
            ...persistedState,
            showStatusBar: true,
            // Re-apply wallpaper default if needed, or keep existing
          };
        }
        return persistedState;
      },
    }
  )
);
