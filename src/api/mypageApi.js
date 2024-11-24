import {authApi} from './api';

// 인솔자 정보 가져오기
export const getGuardianInfo = async () => {
  const response = await authApi.get(`/guardian`);
  return response.data;
};

export const getParentsInfo = async () => {
  const response = await authApi.get(`/parents`);
  console.log(response.data, '부모 정보');
  return response.data;
};

// 그룹 정보 가져오기
export const getGroupInfo = async () => {
  const response = await authApi.get(`/guardian/group`);
  return response.data;
};

export const getStudentInfo = async () => {
  const response = await authApi.get(`/students`);
  return response.data;
};

export const patchStudentNote = async () => {
  const response = await authApi.patch(`/students/update/notes`);
  return response.data;
};

export const patchStudentImage = async () => {
  const response = await authApi.patch(`/students/update/imageFile`);
  return response.data;
};
