import { useQuery } from '@tanstack/react-query';
import { getStudentsByWaypoint } from '../../../api/shuttleApi';

const useStudentList = (waypointId) => {
  return useQuery({
    queryKey: ['studentList', waypointId],
    queryFn: () => getStudentsByWaypoint(waypointId),
  });
};

export default useStudentList;