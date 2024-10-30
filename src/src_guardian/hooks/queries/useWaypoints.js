import { useQuery } from '@tanstack/react-query';
import { getWaypoints } from '../../../api/shuttleApi';

const useWaypoints = () => {
  return useQuery({
    queryKey: ['waypoints'],
    queryFn: getWaypoints,
  });
};

export default useWaypoints;
