import { useMutation } from '@tanstack/react-query';
import { completeAttendance } from '../../../api/shuttleApi';

const useCompleteAttendance = (waypointId) => {
  return useMutation({
    mutationFn: () => completeAttendance(waypointId),
    onError: (error) => {
      console.error(error.response.data.message);
    },
  });
};

export default useCompleteAttendance;