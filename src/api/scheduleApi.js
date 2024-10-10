import { authApi } from "./api";

export const getDailySchedule = async (date) => {
  const response = await authApi.get(`/schedules/group/1/date?specificDate=${date}`);
  console.log(response.data, '일별 그룹 스케줄 불러오기');
  return response.data;
};