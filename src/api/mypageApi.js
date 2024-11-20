import {authApi} from './api';

// 인솔자 정보 가져오기
export const getGuardianInfo = async () => {
  const response = await authApi.get(`/guardian`);
  return response.data;
};

export const getParentsInfo = async () => {
  const response = await authApi.get(`/parents`);
  return response.data;
};

// 그룹 정보 가져오기
export const getGroupInfo = async () => {
  const response = await authApi.get(`/guardian/group`);
  return response.data;
};

export const getParentsGroupInfo = async () => {
  const response = await authApi.get(`/parents/group`);
  return response.data;
};