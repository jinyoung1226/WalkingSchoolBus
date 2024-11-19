import {authApi} from './api';

export const logOut = async () => {
  await authApi.post(`/auth/signOut`);
  console.log('로그아웃 성공');
};
