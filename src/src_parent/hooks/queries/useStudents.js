import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../../../api/shuttleApi';

const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });
};

export default useStudents;