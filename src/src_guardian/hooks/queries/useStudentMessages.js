import { useQuery } from '@tanstack/react-query';
import { getStudentMessages } from '../../../api/shuttleApi';

const useStudentMessages = (studentId) => {
  return useQuery({
    queryKey: ['studentMessages', studentId],
    queryFn: () => getStudentMessages(studentId),
  });
};

export default useStudentMessages;