import { create } from "zustand";

const useBackendurlStore = create((set, get) => ({
    backendurl: (import.meta.env.MODE === 'development') ? 'http://localhost:5000' : 'https://meeting-manage-backend.onrender.com',
}))

export { useBackendurlStore };

