import { useQuery } from '@tanstack/react-query';
import { getStudentMessages } from '../../../api/shuttleApi';

const useStudentMessages = () => {
  return useQuery({
    queryKey: ['studentMessages'],
    queryFn: getStudentMessages,
  });
};

export default useStudentMessages;