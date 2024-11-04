import { useMutation } from '@tanstack/react-query';
import { startGuide } from '../../../api/shuttleApi';

const useStartGuide = () => {

  return useMutation({
    mutationFn: () => startGuide(),
    onSuccess: async (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useStartGuide;