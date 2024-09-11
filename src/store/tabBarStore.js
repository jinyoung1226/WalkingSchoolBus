import { create } from "zustand";

// 탭바 상태 관리 store
const useTabBarStore = create(set => ({
  // 초기 상태 설정
  isTabBarVisible: true,

  // 탭바 보여주는 설정
  showTabBar: () => set({ isTabBarVisible: true }),
  
  // 탭바 숨기는 설정
  hideTabBar: () => set({isTabBarVisible: false }),
}));

export default useTabBarStore;
