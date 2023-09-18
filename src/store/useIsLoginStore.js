import { create } from "zustand";

const useIsLoginStore = create((set, get) => ({
    isLogin: false,
    setIsLogin: (loginState) => set(() => ({ isLogin: loginState }))
}))

export { useIsLoginStore };
