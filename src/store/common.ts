import { create } from 'zustand';

const initialValue = {
	visible: false,
	id: null,
	type: '',
	data: {},
	onClick: () => {},
	onClose: () => {},
	refetch: () => {},
};

const commonStore = (set: any) => ({
	modalConfig: initialValue,
	setModalConfig: (data: any) => set((state: any) => ({ ...state, modalConfig: data })),
	hideCommonModal: () =>
		set({
			modalConfig: initialValue,
		}),
});

const useCommonStore = create(commonStore);

export const { setModalConfig } = useCommonStore.getState();

export default useCommonStore;
