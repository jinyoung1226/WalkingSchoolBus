import { authApi } from "./api";

export const getGroupForGuardian = async () => {
  const response = await authApi.get('guardian/group');
  console.log(response.data, '그룹정보 불러오기');
  return response.data;
};

export const startGuide = async () => {
  const response = await authApi.post(`/group/start-guide`);
  console.log(response.data, '운행 시작');
  return response.data;
};

export const stopGuide = async () => {
  const response = await authApi.post(`/group/stop-guide`);
  console.log(response.data, '운행 종료');
  return response.data;
};

export const getWaypoints = async () => {
  const response = await authApi.get('/waypoints');
  console.log(response.data, '경유지 불러오기');
  return response.data;
};

export const getStudentsByWaypoint = async (waypointId) => {
  const response = await authApi.get(`waypoints/${waypointId}/students`);
  console.log(response.data, '경유지에 배정된 학생 불러오기');
  return response.data;
};

export const completeAttendance = async (waypointId) => {
  const response = await authApi.post(`/attendance/${waypointId}/complete`);
  console.log(response.data, '출석 완료');
  return response.data;
};

export const getGuideStatus = async () => {
  const response = await authApi.get('/group/guide-status');
  console.log(response.data, '운행 상태 불러오기');
  return response.data;
}

export const getStudentMessages = async () => {
  const response = await authApi.get('/message/received');
  console.log(response.data, '학생 메시지 불러오기');
  return response.data;
}