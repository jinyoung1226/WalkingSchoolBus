import { useMutation } from '@tanstack/react-query';
import { startGuide } from '../../../api/shuttleApi';
import useShuttleStore from '../../guardianStore/useShuttleStore';

const useStartGuide = (groupId) => {
  const { setIsGuideActive } = useShuttleStore();

  return useMutation({
    mutationFn: () => startGuide(groupId),
    onSuccess: async (response) => {
      console.log(response);
      setIsGuideActive(response.isGuideActive);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useStartGuide;