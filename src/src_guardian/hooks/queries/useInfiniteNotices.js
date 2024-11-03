import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchNotices} from '../../../api/noticeApi';

const useInfiniteNotices = () => {
  return useInfiniteQuery({
    queryKey: ['notices'],
    queryFn: ({pageParam = 0}) => fetchNotices(pageParam),
    getNextPageParam: lastPage => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    cacheTime: 0,
    staleTime: 0,
  });
};

export default useInfiniteNotices;
