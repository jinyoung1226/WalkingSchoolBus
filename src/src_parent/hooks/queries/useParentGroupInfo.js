import { useQuery } from '@tanstack/react-query';
import { getGroupForParent } from '../../../api/shuttleApi';

const useParentGroupInfo = () => {
  return useQuery({
    queryKey: ['parentGroupInfo'],
    queryFn: getGroupForParent,
  });
};

export default useParentGroupInfo;