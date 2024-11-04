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

export const createNotice = async (content, photos) => {
  try {
    const formData = new FormData();
    formData.append('content', content);

    // photos 배열을 통해 여러 이미지 파일 추가
    photos.forEach((photo, index) => {
      formData.append('photos', {
        uri: photo.uri,
        type: photo.type || 'image/jpeg', // 이미지 타입 지정
        name: photo.name || `photo_${index}.jpg`,
      });
    });

    const response = await authApi.post('/group-notices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
};
