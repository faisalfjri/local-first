import { create } from 'zustand';

type StatusState = {
  isOnline: boolean;
  isSyncing: boolean;
  hasChanges: boolean;
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setChanges: (changes: boolean) => void;
};

export const useStatusStore = create<StatusState>((set) => ({
  isOnline: false,
  isSyncing: false,
  hasChanges: false,
  setOnline: (online) => set({ isOnline: online }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setChanges: (changes) => set({ hasChanges: changes })
}));
