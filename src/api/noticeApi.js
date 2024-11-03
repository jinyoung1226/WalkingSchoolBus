// noticeApi.js

import {authApi} from './api';

// 공지 불러오기
export const fetchNotices = async (page = 0, size = 10) => {
  const response = await authApi.get(
    `/group-notices/group/notices?page=${page}&size=${size}`,
  );
  const data = response.data;

  // 응답 데이터 가공
  const transformedNotices = data.content.map(notice => ({
    groupNoticeId: notice.groupNoticeId,
    content: notice.content || '',
    photos: Array.isArray(notice.photos) ? notice.photos : [],
    likes: typeof notice.likes === 'number' ? notice.likes : 0,
    createdAt: notice.createdAt || '',
    authorName: notice.guardian?.name || '작성자',
    authorImage: notice.guardian?.imagePath || '',
    isLiked: notice.isLiked || false,
  }));

  return {
    ...data,
    content: transformedNotices,
  };
};
