import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toggleLike} from '../../../api/noticeApi';

const useNoticeLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: id => toggleLike(id),
    onMutate: async id => {
      await queryClient.cancelQueries({queryKey: ['notices']});

      const previousNotices = queryClient.getQueryData(['notices']);
      queryClient.setQueryData(['notices'], oldData => {
        if (!oldData) return oldData;

        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              content: page.content.map(notice =>
                notice.groupNoticeId === id
                  ? {
                      ...notice,
                      isLiked: !notice.isLiked,
                      likes: notice.isLiked
                        ? notice.likes - 1
                        : notice.likes + 1,
                    }
                  : notice,
              ),
            })),
          };
        } else {
          return {
            ...oldData,
            content: oldData.content.map(notice =>
              notice.groupNoticeId === id
                ? {
                    ...notice,
                    isLiked: !notice.isLiked,
                    likes: notice.isLiked ? notice.likes - 1 : notice.likes + 1,
                  }
                : notice,
            ),
          };
        }
      });
      return {previousNotices};
    },
    onError: context => {
      queryClient.setQueryData(['notices'], context.previousNotices);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    },
  });
};

export default useNoticeLike;
