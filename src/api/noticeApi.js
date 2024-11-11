import {authApi} from './api';

export const fetchNotices = async ({pageParam = 0, size = 10}) => {
  console.log('aaaa');
  const response = await authApi.get(
    `group-notices/group/notices?page=${pageParam}&${size}`,
  );
  return response.data;
};

export const createNotice = async (content, photos) => {
  const formData = new FormData();
  formData.append('content', content);

  photos.forEach((photo, index) => {
    formData.append('photos', {
      uri: photo.uri,
      type: photo.type || 'image/jpeg',
      name: photo.name || `photo_${index}.jpg`,
    });
  });

  const response = await authApi.post('/group-notices', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const toggleLike = async groupNoticeId => {
  const response = await authApi.post(`/group-notices/${groupNoticeId}/like`);
  return response.data;
};
