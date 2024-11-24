import {useQuery} from '@tanstack/react-query';
import {getGuardianInfo} from '../../../api/mypageApi';

const useGuardianInfo = () => {
  return useQuery({
    queryKey: ['guardian'],
    queryFn: getGuardianInfo,
  });
};

export default useGuardianInfo;
