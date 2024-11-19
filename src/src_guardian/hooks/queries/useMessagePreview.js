import { useQuery } from '@tanstack/react-query';
import { getMessagePreview } from '../../../api/shuttleApi';

const useMessagePreview = (studentId) => {
  return useQuery({
    queryKey: ['MessagePreview', studentId],
    queryFn: () => getMessagePreview(studentId),
  });
};

export default useMessagePreview;