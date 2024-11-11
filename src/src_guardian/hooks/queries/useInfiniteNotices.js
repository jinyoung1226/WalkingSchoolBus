import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchNotices} from '../../../api/noticeApi';

const useInfiniteNotices = (size = 10) => {
  return useInfiniteQuery({
    queryKey: ['notices', size], // size를 queryKey에 포함하여 캐시를 구분
    queryFn: ({pageParam = 0}) => fetchNotices({pageParam, size}), // size 전달
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    staleTime: 60000, // 데이터는 1분 동안 신선한 상태로 간주됩니다.
    cacheTime: 300000, // 캐시는 5분 동안 유지됩니다.
    refetchOnMount: false, // 마운트 시 데이터가 신선하면 재요청하지 않습니다.
  });
};

export default useInfiniteNotices;
