import { useMutation } from '@tanstack/react-query'
import { stopGuide } from '../../../api/shuttleApi';

const useStopGuide = () => {

  return useMutation({
    mutationFn: () => stopGuide(),
    onSuccess: async (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useStopGuide;