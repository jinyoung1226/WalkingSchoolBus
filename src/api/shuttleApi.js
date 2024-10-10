import { authApi } from "./api";

export const getGroupForGuardian = async () => {
  const response = await authApi.get('guardian/group');
  console.log(response.data, '그룹정보 불러오기');
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