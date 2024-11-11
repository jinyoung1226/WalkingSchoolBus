import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {refreshApi} from '../api/api';
import config from '../config/config';
import * as StompJs from '@stomp/stompjs';

let webSocketClient = null;

let groupSubscription = null;
let subscribedGroup = null;

let locationSubscription = null;
let subscribedLocation = null;

// 웹소캣 상태 관리 store
const useWebsocketStore = create(set => ({
  isConnected: false,

  // 웹소캣 연결 함수
  connectWebSocket: async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const client = token => 
          new StompJs.Client({
            brokerURL: `${config.WEBSOCKET_URL}/ws`,
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            connectHeaders: {accessToken: token},
            reconnectDelay: 500,
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
        
                webSocketClient = client(response.data.accessToken);
                webSocketClient.activate();
              } else {
                console.error('토큰 재발급 실패');
              }
            },
          });
        webSocketClient = client(accessToken);
        webSocketClient.activate();
        // WebSocket 연결 성공 시 호출
        webSocketClient.onConnect = () => {
          console.log('WebSocket 연결 성공');
          set({isConnected: true});
          if (subscribedGroup) {
            console.log('이전 구독 채널 다시 구독: ', subscribedGroup);
            useWebsocketStore.getState().subscribeToChannel(subscribedGroup);
          }
          if (subscribedLocation) {
            console.log('이전 위치 구독 채널 다시 구독: ', subscribedLocation);
            useWebsocketStore.getState().subscribeToLocationChannel(subscribedLocation);
          }
        };
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
        subscribedGroup = { channel, callback };
        console.log(groupSubscription)
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
        subscribedGroup = null;
      } catch (error) {
        console.error('구독 해제 실패', error);
      }
    } else {
      console.log('구독 중인 채널이 없습니다.');
    }
  },

  subscribeToLocationChannel: async ({channel, callback}) => {
    if (webSocketClient && webSocketClient.connected) {
      try {
        console.log('구독 성공');
        locationSubscription = webSocketClient.subscribe(channel, callback);
        subscribedLocation = { channel, callback };
      } catch (error) {
        console.error('구독 실패', error);
      }
    } else {
      console.error('웹소켓이 연결되지 않았습니다.');
    }
  },

  unsubscribeToLocationChannel: async () => {
    if (locationSubscription) {
      try {
        locationSubscription.unsubscribe();
        console.log('구독 해제 성공');
        locationSubscription = null;
        subscribedLocation = null;
      } catch (error) {
        console.error('구독 해제 실패', error);
      }
    } else {
      console.log('구독 중인 채널이 없습니다.');
    }
  },

  publish: async ({destination, header, studentId, attendanceStatus}) => {
    if (webSocketClient) {
      try {
        console.log(destination, header, '메시지 전송');
        webSocketClient.publish({
          destination: destination,
          Headers: header,
          body: JSON.stringify({
            studentId: studentId,
            attendanceStatus: attendanceStatus,
          }),
        });
      } catch (error) {
        console.error('메시지 전송 실패', error);
      }
    } else {
      console.error('WebSocket is not connected.');
    }
  },

  publishLocation: async ({destination, header, latitude, longitude}) => {
    if (webSocketClient) {
      try {
        console.log(destination, header, '메시지 전송');
        webSocketClient.publish({
          destination: destination,
          Headers: header,
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
          }),
        });
      } catch (error) {
        console.error('메시지 전송 실패', error);
      }
    } else {
      console.error('WebSocket is not connected.');
    }
  }


}));

export default useWebsocketStore;
