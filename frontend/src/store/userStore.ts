import { create } from 'zustand';

interface UserStore {
  userData: { email: string; name: string } | null;
  isUserValidated: boolean;
  setUserData: (data: { email: string; name: string }) => void;
  clearUserData: () => void;
  validateUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  isUserValidated: false,
  setUserData: (data) => {
    set({ userData: data, isUserValidated: true });
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('isUserValidated', 'true');
    localStorage.setItem('validationTime', Date.now().toString());
  },
  clearUserData: () => {
    set({ userData: null, isUserValidated: false });
    localStorage.removeItem('userData');
    localStorage.removeItem('isUserValidated');
    localStorage.removeItem('validationTime');
  },
  validateUser: () => {
    const validationTime = localStorage.getItem('validationTime');
    // 30 min
    if (validationTime && (Date.now() - parseInt(validationTime) < 30 * 60 * 1000)) {
      set({ isUserValidated: true });
    } else {
      set({ isUserValidated: false });
    }
  },
}));

interface UserStore {
  userData: { email: string; name: string } | null;
  setUserData: (data: { email: string; name: string }) => void;
  clearUserData: () => void;
}
 