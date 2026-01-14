import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface PayloadInterface {
	user?: Record<string, any>;
	token?: string | null;
	keepLogin?: boolean;
}

const initialState = {
	userInfo: {
		user: {},
		token: '',
	},
	keepLogin: false,
};

const authStore = (set: any) => ({
	...initialState,
	setUserInfo: (data: PayloadInterface) =>
		set((state: any) => ({
			...state,
			userInfo: data,
			keepLogin: data.keepLogin ?? state.keepLogin,
		})),
	setAdminData: (data: any) => set((state: any) => ({ ...state, adminData: data })),
	resetState: () =>
		set(() => ({
			...initialState,
		})),
});

const customStorage = {
	getItem: (name: string) => {
		return sessionStorage.getItem(name) ?? localStorage.getItem(name);
	},
	setItem: (name: string, value: string) => {
		const state = useAuthStore.getState();
		if (state.keepLogin) {
			localStorage.setItem(name, value);
		} else {
			sessionStorage.setItem(name, value);
		}
	},
	removeItem: (name: string) => {
		if (sessionStorage.getItem(name)) {
			sessionStorage.removeItem(name);
		} else {
			localStorage.removeItem(name);
		}
	},
};

const useAuthStore = create(
	devtools(
		persist(authStore, {
			name: 'auth',
			storage: createJSONStorage(() => customStorage),
		}),
	),
);

export const { setUserInfo, resetState, setAdminData } = useAuthStore.getState();

export default useAuthStore;
