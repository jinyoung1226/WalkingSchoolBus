import { useMutation } from '@tanstack/react-query';
import { applyPreabsent } from '../../../api/shuttleApi';

const useApplyPreabsent = () => {
  return useMutation({
    mutationFn: (studentId, date) => applyPreabsent(studentId, date),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error.response.data.message, '사전 결석 신청 에러');
    },
  });
};

export default useApplyPreabsent;