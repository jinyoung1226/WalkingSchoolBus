import { useMutation } from '@tanstack/react-query'
import { stopGuide } from '../../../api/shuttleApi';
import useShuttleStore from '../../guardianStore/useShuttleStore';

const useStopGuide = (groupId) => {
  const { setIsGuideActive } = useShuttleStore();

  return useMutation({
    mutationFn: () => stopGuide(groupId),
    onSuccess: async (response) => {
      console.log(response);
      setIsGuideActive(response.isGuideActive);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useStopGuide;