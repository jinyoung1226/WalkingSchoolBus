import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {refreshApi} from '../api/api';
import config from '../config/config';
import * as StompJs from '@stomp/stompjs';

let webSocketClient = null;

let groupSubscription = null;

// 웹소캣 상태 관리 store
const useWebsocketStore = create(set => ({
  isConnected: false,

  // 웹소캣 연결 함수
  connectWebSocket: async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      try {
        webSocketClient = client(accessToken);

        // WebSocket 연결 성공 시 호출
        webSocketClient.onConnect = () => {
          console.log('WebSocket 연결 성공');
          set({isConnected: true});
        };

        webSocketClient.activate();
      } catch (error) {
        console.error('웹소캣 연결 실패', error);
        set({isConnected: false});
      }
    } else {
      console.error('액세스 토큰이 없습니다.');
      set({isConnected: false});
    }
  },

  // 웹소캣 해제 함수
  disconnectWebSocket: async () => {
    if (webSocketClient) {
      try {
        webSocketClient.deactivate();
        console.log('웹소켓 연결 해제');
        set({isConnected: false});
      } catch (error) {
        console.error('웹소켓 연결 해제 실패', error);
        set({isConnected: true});
      }
    } else {
      console.log('웹소켓 클라이언트가 존재하지 않습니다.');
      set({isConnected: false});
    }
  },

  subscribeToChannel: async ({channel, callback}) => {
    if (webSocketClient && webSocketClient.connected) {
      try {
        console.log('구독 성공');
        groupSubscription = webSocketClient.subscribe(channel, callback);
      } catch (error) {
        console.error('구독 실패', error);
      }
    } else {
      console.error('웹소켓이 연결되지 않았습니다.');
    }
  },

  unsubscribeToChannel: async () => {
    if (groupSubscription) {
      try {
        groupSubscription.unsubscribe();
        console.log('구독 해제 성공');
        groupSubscription = null;
      } catch (error) {
        console.error('구독 해제 실패', error);
      }
    } else {
      console.log('구독 중인 채널이 없습니다.');
    }
  },

}));

// Stomp 프로토콜 기반 웹소캣 클라이언트 생성 함수
const client = token => {
  return new StompJs.Client({
    brokerURL: `${config.WEBSOCKET_URL}/ws`,
    forceBinaryWSFrames: true,
    appendMissingNULLonIncoming: true,
    connectHeaders: {accessToken: token},
    reconnectDelay: 5000,
    debug: function (str) {
      console.log(str, '웹소캣 연결 로그');
    },
    onStompError: async function (str) {
      console.log('웹소캣 연결 에러 발생: ', str);
      const response = await refreshApi.post('/token/re-issue');
      if (response.status === 200) {
        console.log('토큰 재발급 성공');

        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        await EncryptedStorage.setItem(
          'refreshToken',
          response.data.refreshToken,
        );

        const newClient = client(response.data.accessToken);
        newClient.activate();
      } else {
        console.error('토큰 재발급 실패');
      }
    },
  });
};

export default useWebsocketStore;
