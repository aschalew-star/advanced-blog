import { create } from 'zustand';

type Notification = {
  type: string;
  message: string;
  postId?: string;
  // etc.
};

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Notification) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAllRead: () => set({ unreadCount: 0 }),
}));