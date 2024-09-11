import {create} from 'zustand';

// 로그인 상태 관리 store
const useAuthStore = create(set => ({
  // 초기 상태 설정
  isAuthenticated: false,
  accessToken: null,
  userType: null,
  isLoading: false,
  isAutoLoginLoading: false,
  userId: null,

  // 로그인 상태 설정
  setLogin: (isAuthenticated, accessToken, userType, userId) => {
    set({isAuthenticated, accessToken, userType, userId});
  },

  // 유저 타입 상태 설정
  setUserType: userType => {
    set({userType});
  },

  // 로그아웃 상태 설정
  setLogout: (isAuthenticated, accessToken, userType, userId) => {
    set({isAuthenticated, accessToken, userType, userId});
  },
}));

export default useAuthStore;
