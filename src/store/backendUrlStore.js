import { create } from "zustand";

const useBackendurlStore = create((set, get) => ({
    backendurl: 'https://meeting-manage-backend.onrender.com',
}))

export { useBackendurlStore };

