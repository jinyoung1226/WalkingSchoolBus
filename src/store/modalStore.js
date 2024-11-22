import{create} from 'zustand';

export const useModalStore = create((set) => ({
  visible: false,
  content: null,
  showModal: (content) =>
    set({ visible: true, content }),
  hideModal: () =>
    set({ visible: false, content: null }),
}));
