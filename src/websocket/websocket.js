// import * as StompJs from '@stomp/stompjs';
// import config from '../config/config';
// import {refreshApi} from '../api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import EncryptedStorage from 'react-native-encrypted-storage';
// import useWebsocketStore from '../store/websocketStore';

// // 웹소캣 연결
// export const connectWebSocket = async () => {

//   const accessToken = await AsyncStorage.getItem('accessToken');

//   if (accessToken) {
//     try {
//       webSocketClient = client(accessToken);
//       webSocketClient.activate();
//       return setConnected(true);
//     } catch (error) {
//       console.error('웹소캣 연결 실패', error);
//       return setConnected(false);
//     }
//   } else {
//     console.error('액세스 토큰이 없습니다.');
//     return setConnected(false);
//   }
// };

// // 웹소캣 해제
// export const disconnectWebSocket = async () => {
//   const {setConnected} = useWebsocketStore();

//   if (webSocketClient) {
//     try {
//       webSocketClient.deactivate();
//       console.log('웹소켓 연결 해제');
//       return setConnected(false);
//     } catch (error) {
//       console.error('웹소켓 연결 해제 실패', error);
//       return setConnected(true);
//     }
//   } else {
//     console.log('웹소켓 클라이언트가 존재하지 않습니다.');
//     return setConnected(false);
//   }
// };

// // Stomp 프로토콜 기반 웹소캣 클라이언트 생성 함수
// const client = token =>
//   new StompJs.Client({
//     brokerURL: `${config.WEBSOCKET_URL}/ws`,
//     forceBinaryWSFrames: true,
//     appendMissingNULLonIncoming: true,
//     connectHeaders: {accessToken: token},
//     reconnectDelay: 1000,
//     debug: function (str) {
//       console.log(str, '웹소캣 연결 로그');
//     },
//     onStompError: async function (str) {
//       console.log('웹소캣 연결 에러 발생: ', str);
//       const response = await refreshApi.post('/token/re-issue');
//       if (response.status === 200) {
//         console.log('토큰 재발급 성공');
//         await AsyncStorage.setItem('accessToken', response.data.accessToken);
//         await EncryptedStorage.setItem(
//           'refreshToken',
//           response.data.refreshToken,
//         );

//         webSocketClient = client(response.data.accessToken);
//         webSocketClient.activate();
//       } else {
//         console.error('토큰 재발급 실패');
//       }
//     },
//   });
