import axios from 'axios';
import config from '../config/config';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

// API 호출을 위한 axios 인스턴스 (로그인 전에 사용)
export const api = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// refreshToken 헤더에 삽입하는 경우에 사용 (로그아웃 or 자동로그인 시 사용)
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

// 로그인 후, 모든 요청은 해당 API를 사용 (로그인 후에 사용)
export const authApi = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

authApi.interceptors.request.use(
  async config => {
    console.log('헤더에 토큰 삽입');
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      console.log(accessToken);
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    console.log('액세스토큰 존재');
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

authApi.interceptors.response.use(
  response => {
    console.log('authApi응답');
    return response;
  },
  async error => {
    const originalRequest = error.config;
    //  토큰 만료 등의 조건을 확인하고 토큰 재발급 로직 실행
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log(error, 'aaaa401');
      originalRequest._retry = true; // 재시도 플래그 설정
      // 토큰 재발급 로직...
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      console.log(refreshToken, '리프레쉬');
      try {
        const response = await refreshApi.post(`/token/re-issue`);
        if (response.status === 200) {
          console.log(response.data, 're-issue');
          await AsyncStorage.setItem('accessToken', response.data.accessToken);
          await EncryptedStorage.setItem(
            'refreshToken',
            response.data.refreshToken,
          );
          // 새 토큰 저장
          authApi.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.accessToken}`; // 인스턴스의 기본 헤더 업데이트
          return authApi(originalRequest); // 원래 요청 재시도
        }
      } catch (error) {
        if (error.response.status == 401) {
          // Alert.alert(error.response.data.message);
          return Promise.reject(error.response.data.message);
        }
      }
    }
    return Promise.reject(error);
  },
);

export const formDataApi = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

formDataApi.interceptors.request.use(
  async config => {
    console.log('헤더에 토큰 삽입');
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      console.log(accessToken);
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    console.log('액세스토큰 존재');
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

formDataApi.interceptors.response.use(
  response => {
    console.log('authApi응답');
    return response;
  },
  async error => {
    const originalRequest = error.config;
    //  토큰 만료 등의 조건을 확인하고 토큰 재발급 로직 실행
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log(error, 'aaaa401');
      originalRequest._retry = true; // 재시도 플래그 설정
      // 토큰 재발급 로직...
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      console.log(refreshToken, '리프레쉬');
      try {
        const response = await refreshApi.post(`/token/re-issue`);
        if (response.status === 200) {
          console.log(response.data, 're-issue');
          await AsyncStorage.setItem('accessToken', response.data.accessToken);
          await EncryptedStorage.setItem(
            'refreshToken',
            response.data.refreshToken,
          );
          // 새 토큰 저장
          authApi.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.accessToken}`; // 인스턴스의 기본 헤더 업데이트
          return authApi(originalRequest); // 원래 요청 재시도
        }
      } catch (error) {
        if (error.response.status == 401) {
          // Alert.alert(error.response.data.message);
          return Promise.reject(error.response.data.message);
        }
      }
    }
    return Promise.reject(error);
  },
);
