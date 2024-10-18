import { useQuery } from '@tanstack/react-query';
import { getGroupForGuardian } from '../../../api/shuttleApi';

const useGroupInfo = () => {
  return useQuery({
    queryKey: ['groupInfo'],
    queryFn: getGroupForGuardian,
  });
};

export default useGroupInfo;