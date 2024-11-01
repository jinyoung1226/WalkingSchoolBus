import { useQuery } from '@tanstack/react-query';
import { getGuideStatus } from '../../../api/shuttleApi';

const useGuideStatus = () => {
  return useQuery({
    queryKey: ['guideStatus'],
    queryFn: getGuideStatus,
  });
};

export default useGuideStatus;