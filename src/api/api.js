import axios from 'axios';
import config from '../config/config';
import EncryptedStorage from 'react-native-encrypted-storage';

// API 호출을 위한 axios 인스턴스 (로그인 전에 사용)
export const api = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 로그아웃을 위한 axios 인스턴스 (로그인 후에 사용)
export const refreshApi = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// 로그아웃 api 호출 후, interceptors로 요청을 가로채 refresh 토큰 삽입
refreshApi.interceptors.request.use(
  async config => {
    console.log('헤더에 토큰 삽입');
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    if (refreshToken) {
      console.log(refreshToken, '리프레쉬 토큰');
      config.headers['Authorization'] = `Bearer ${refreshToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 로그아웃 api 응답이 오기 전, interceptors로 응답을 가로채 응답 생성
refreshApi.interceptors.response.use(response => {
  console.log('refreshApi 응답');
  return response;
});
