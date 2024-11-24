import { useQuery } from '@tanstack/react-query';
import { getParentsInfo } from '../../../api/mypageApi';

const useParentsInfo = () => {
  return useQuery({
    queryKey: ['parentsInfo'],
    queryFn: getParentsInfo,
  });
};

export default useParentsInfo;