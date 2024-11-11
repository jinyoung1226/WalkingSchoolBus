import { useMutation } from '@tanstack/react-query'
import { stopGuide } from '../../../api/shuttleApi';
import useShuttleStore from '../../guardianStore/useShuttleStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStopGuide = () => {
  const {setIsGuideActive} = useShuttleStore();
  return useMutation({
    mutationFn: () => stopGuide(),
    onSuccess: async () => {
      setIsGuideActive(false);
      await AsyncStorage.setItem('isGuideActive', 'false');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useStopGuide;