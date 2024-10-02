import React, {useEffect} from 'react';
import MainNavigator from '../src_guardian/nav/MainNavigator';
import AuthNavigator from '../src_guardian/nav/AuthNavigator';
import useAuthStore from '../store/authStore';
import useWebsocketStore from '../store/websocketStore';

const GuardianRootNavigator = () => {
  const {isAuthenticated} = useAuthStore();
  const {connectWebSocket, disconnectWebSocket, isConnected} =
    useWebsocketStore();

  // WebSocket 연결/해제 useEffect hook
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    }

    return () => {
      if (isAuthenticated) {
        disconnectWebSocket();
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('isConnected 상태 변경:', isConnected);
  }, [isConnected]);

  return <>{isAuthenticated ? <MainNavigator /> : <AuthNavigator />}</>;
};

export default GuardianRootNavigator;
