import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchNotices} from '../../../api/noticeApi';

const useInfiniteNotices = () => {
  return useInfiniteQuery({
    queryKey: ['notices'],
    queryFn: fetchNotices,
    initialPageParam: 0,
    size: 10,
    getNextPageParam: lastPage => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    staleTime: 60000, // 데이터는 1분 동안 신선한 상태로 간주됩니다.
    cacheTime: 300000, // 캐시는 5분 동안 유지됩니다.
    refetchOnWindowFocus: true, // 화면에 포커스될 때 자동으로 재요청합니다.
    refetchOnMount: false, // 마운트 시 데이터가 신선하면 재요청하지 않습니다.
  });
};

export default useInfiniteNotices;
