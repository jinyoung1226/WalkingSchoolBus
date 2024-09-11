import React from 'react';
import MainNavigator from '../src_guardian/nav/MainNavigator';
import AuthNavigator from '../src_guardian/nav/AuthNavigator';
import useAuthStore from '../store/authStore';

const GuardianRootNavigator = () => {
  const {isAuthenticated} = useAuthStore();

  // 자동 로그인 처리 들어갈 부분

  return <>{isAuthenticated ? <MainNavigator /> : <AuthNavigator />}</>;
};

export default GuardianRootNavigator;
