import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';

// --- Types ---

export interface ChatRule {
  id: string;
  content: string;
}

export interface Contact {
  id: string;
  name: string; 
  nickname?: string; 
  avatar: string; 
  systemPrompt: string;
  bio?: string;
  memoryDepth: number; 
  chatRules: ChatRule[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  contactId: string;
  messages: Message[];
  lastMessage: string;
  lastTimestamp: number;
  unreadCount: number;
}

export interface UserMask {
  id: string;
  name: string; // e.g. "Professional"
  description: string; // "I am a senior engineer..."
}

export interface UserProfile {
  name: string;
  wechatId: string;
  avatar: string; 
  balance: number;
  masks: UserMask[];
  activeMaskId: string | null;
}

interface AppState {
  userProfile: UserProfile;
  contacts: Contact[];
  sessions: ChatSession[];
  
  // Actions
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addUserMask: (mask: Omit<UserMask, 'id'>) => void;
  deleteUserMask: (id: string) => void;
  setActiveMask: (id: string | null) => void;

  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  
  createSession: (contactId: string) => string; 
  deleteSession: (id: string) => void;
  addMessage: (sessionId: string, message: Omit<Message, 'timestamp'>) => void;
  clearSessionMessages: (sessionId: string) => void;
  
  getOrCreateSession: (contactId: string) => string;
}

// --- Store ---

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProfile: {
        name: 'User',
        wechatId: 'ai_user_001',
        avatar: '', 
        balance: 8888.88,
        masks: [],
        activeMaskId: null
      },
      contacts: [
        {
          id: 'default-ai',
          name: 'AI 助手',
          nickname: '小助手',
          avatar: '#007aff',
          systemPrompt: '你是一个智能助手。',
          bio: '默认的智能助手',
          memoryDepth: 10,
          chatRules: []
        }
      ],
      sessions: [],

      updateUserProfile: (updates) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...updates }
        }));
      },

      addUserMask: (mask) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            masks: [...(state.userProfile.masks || []), { ...mask, id: nanoid() }]
          }
        }));
      },

      deleteUserMask: (id) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            masks: (state.userProfile.masks || []).filter(m => m.id !== id),
            activeMaskId: state.userProfile.activeMaskId === id ? null : state.userProfile.activeMaskId
          }
        }));
      },

      setActiveMask: (id) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            activeMaskId: id
          }
        }));
      },

      addContact: (contact) => {
        set((state) => ({
          contacts: [...state.contacts, { ...contact, id: nanoid() }]
        }));
      },

      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }));
      },

      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((c) => 
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },

      createSession: (contactId) => {
        const newSessionId = nanoid();
        set((state) => ({
          sessions: [
            {
              id: newSessionId,
              contactId,
              messages: [],
              lastMessage: '',
              lastTimestamp: Date.now(),
              unreadCount: 0
            },
            ...state.sessions
          ]
        }));
        return newSessionId;
      },

      getOrCreateSession: (contactId) => {
        const { sessions, createSession } = get();
        const existingSession = sessions.find(s => s.contactId === contactId);
        if (existingSession) {
          return existingSession.id;
        }
        return createSession(contactId);
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id)
        }));
      },

      addMessage: (sessionId, message) => {
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== sessionId) return s;
            
            const newMessage: Message = {
              ...message,
              timestamp: Date.now()
            };
            
            return {
              ...s,
              messages: [...s.messages, newMessage],
              lastMessage: message.role === 'user' ? message.content : message.content, 
              lastTimestamp: Date.now()
            };
          }).sort((a, b) => b.lastTimestamp - a.lastTimestamp) 
        }));
      },

      clearSessionMessages: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.map((s) => 
            s.id === sessionId ? { ...s, messages: [], lastMessage: '', lastTimestamp: Date.now() } : s
          )
        }));
      }
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          return {
            ...persistedState,
            userProfile: {
              ...(persistedState.userProfile || {}),
              masks: persistedState.userProfile?.masks || [],
              activeMaskId: persistedState.userProfile?.activeMaskId || null,
            },
          };
        }
        return persistedState;
      },
    }
  )
);
