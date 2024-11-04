import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toggleLike} from '../../../api/noticeApi';

const useNoticeLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, isCurrentlyLiked}) => toggleLike(id, isCurrentlyLiked),
    queryKey: ['notices'],
    onMutate: async ({id, isCurrentlyLiked}) => {
      await queryClient.cancelQueries({queryKey: ['notices']});

      const previousNotices = queryClient.getQueryData(['notices']);
      queryClient.setQueryData(['notices'], old => {
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            content: page.content.map(notice =>
              notice.groupNoticeId === id
                ? {
                    ...notice,
                    isLiked: !isCurrentlyLiked,
                    likes: isCurrentlyLiked
                      ? notice.likes - 1
                      : notice.likes + 1,
                  }
                : notice,
            ),
          })),
        };
      });
      return {previousNotices};
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['notices'], context.previousNotices);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['notices']});
    },
  });
};

export default useNoticeLike;
