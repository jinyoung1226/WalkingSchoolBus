import { useQuery } from '@tanstack/react-query';
import { getParentShuttleStatus } from '../../../api/shuttleApi';

const useShuttleStatus = () => {
  return useQuery({
    queryKey: ['parentShuttleStatus'],
    queryFn: getParentShuttleStatus,
  });
};

export default useShuttleStatus;