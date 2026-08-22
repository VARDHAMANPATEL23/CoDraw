import { create } from 'zustand';

const useAppStore = create((set) => ({
  updateAvailable: false,
  serviceWorkerRegistration: null,
  setUpdateAvailable: (registration) =>
    set({ updateAvailable: true, serviceWorkerRegistration: registration }),
  clearUpdate: () => set({ updateAvailable: false, serviceWorkerRegistration: null }),
}));

export default useAppStore;
