import { create } from 'zustand';

const userStore = (set: any) => ({
	profileData: {},
	tempLoginData: {},
	setProfileData: (data: boolean) => set((state: any) => ({ ...state, profileData: data })),
	setTempLoginData: (data: any) => set((state: any) => ({ ...state, tempLoginData: data })),
});

const useUserStore = create(userStore);

export const { setProfileData, setTempLoginData } = useUserStore.getState();

export default useUserStore;
