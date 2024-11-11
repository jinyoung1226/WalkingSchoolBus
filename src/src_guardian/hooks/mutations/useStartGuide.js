import { useMutation } from '@tanstack/react-query';
import { startGuide } from '../../../api/shuttleApi';
import useShuttleStore from '../../guardianStore/useShuttleStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
const useStartGuide = () => {
  const {setIsGuideActive} = useShuttleStore();
  return useMutation({
    mutationFn: () => startGuide(),
    onSuccess: async () => {
      setIsGuideActive(true);
      await AsyncStorage.setItem('isGuideActive', 'true');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useStartGuide;