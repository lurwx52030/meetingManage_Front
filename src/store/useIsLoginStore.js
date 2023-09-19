import { create } from "zustand";

const useIsLoginStore = create((set, get) => ({
    isLogin: localStorage.getItem('jwtToken')||false,
    setIsLogin: (loginState) => set(() => ({ isLogin: loginState }))
}))

export { useIsLoginStore };
