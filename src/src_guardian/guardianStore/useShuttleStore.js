import {create} from 'zustand';

const useShuttleStore = create(set => ({
  isGuideActive: false,
  setIsGuideActive: isGuideActive => set({isGuideActive}),
}));

export default useShuttleStore;
// 서버에서 api로 받아오면 queryClient사용하면 되니까 이거 제거해도 될듯