// ../store/noticeStore.js
import create from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const BASE_URL = 'https://walkingschoolbus.store';

const useNoticeStore = create((set, get) => ({
  notices: [], // 공지 리스트 상태
  error: null, // fetch 요청 시의 오류 상태
  hasNextPage: true, // 다음 페이지 존재 여부
  page: 0, // 현재 페이지 번호

  // 공지 리스트를 설정하는 함수
  setNotices: newNotices => {
    console.log('Setting notices:', newNotices);
    set({notices: newNotices});
  },

  // 공지를 비우는 함수
  clearNotices: () => set({notices: []}),

  // 공지 리스트 데이터를 서버에서 가져오는 함수 (fetch)
  fetchNotices: async (pageToLoad = 0, size = 10) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Retrieved access token:', token);

      if (!token) {
        console.error('Access token is missing');
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const authHeader = `Bearer ${token}`;
      console.log('Authorization header:', authHeader);

      const response = await axios.get(
        `${BASE_URL}/group-notices/group/notices?page=${pageToLoad}&size=${size}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        },
      );

      console.log('Response status:', response.status);
      console.log('Full Response Data:', JSON.stringify(response.data, null, 2));

      if (response.status === 200) {
        if (!Array.isArray(response.data.content)) {
          throw new Error('Invalid data format: content is not an array');
        }

        const transformedNotices = response.data.content
          .map((notice, index) => {
            if (!notice || !notice.groupNoticeId) {
              console.warn(`Notice at index ${index} is missing groupNoticeId or is undefined:`, notice);
              return null;
            }
            return {
              id: notice.groupNoticeId,
              content: notice.content || '',
              photos: Array.isArray(notice.photos) ? notice.photos : [],
              likes: typeof notice.likes === 'number' ? notice.likes : 0,
              createdAt: notice.createdAt || '',
              authorName: notice.guardian?.name || '작성자',
              authorImage: notice.guardian?.imagePath || '',
              isLiked: notice.isLiked || false,
            };
          })
          .filter(notice => notice !== null);

        const sortedNotices = transformedNotices.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        if (pageToLoad === 0) {
          set({notices: sortedNotices});
        } else {
          set(state => ({notices: [...state.notices, ...sortedNotices]}));
        }

        if (typeof response.data.last !== 'undefined') {
          set({hasNextPage: !response.data.last});
        } else if (typeof response.data.totalPages !== 'undefined') {
          set({hasNextPage: pageToLoad + 1 < response.data.totalPages});
        } else {
          set({hasNextPage: transformedNotices.length === size});
        }

        set({error: null, page: pageToLoad}); // 에러 상태 초기화 및 현재 페이지 갱신
      } else {
        console.error('Failed to fetch notices, status code:', response.status);
        set({
          error: `Failed to fetch notices, status code: ${response.status}`,
        });
      }
    } catch (error) {
      console.error('Error fetching notices:', error);

      // 403 에러가 발생한 경우에만 error 상태를 "403"으로 설정
      if (error.response?.status === 403) {
        set({ error: 403 });
      } else {
        set({ error: '공지사항을 불러오는 중 오류가 발생했습니다.' });
      }
    }
  },

  // 다음 페이지를 로드하는 함수 (무한 스크롤을 위해 추가)
  loadMoreNotices: async () => {
    const {hasNextPage, page} = get();
    
    if (hasNextPage) {
      await get().fetchNotices(page + 1);
    }
  },

  // 특정 공지의 좋아요 토글 함수
  toggleLike: async id => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('Access token is missing');
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const authHeader = `Bearer ${token}`;
      console.log('Authorization header:', authHeader);

      const noticeIndex = get().notices.findIndex(notice => notice.id === id);
      if (noticeIndex === -1) {
        console.error('Notice not found in the store:', id);
        return;
      }

      const notice = get().notices[noticeIndex];
      const isCurrentlyLiked = notice.isLiked;

      const updatedNotices = [...get().notices];
      updatedNotices[noticeIndex] = {
        ...notice,
        isLiked: !isCurrentlyLiked,
        likes: isCurrentlyLiked ? notice.likes - 1 : notice.likes + 1,
      };
      set({notices: updatedNotices});

      const endpoint = `${BASE_URL}/group-notices/${id}/like`;

      if (!isCurrentlyLiked) {
        await axios.post(endpoint, {}, {
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        });
      } else {
        await axios.delete(endpoint, {
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', '좋아요를 처리하는 중 오류가 발생했습니다.');

      const noticeIndex = get().notices.findIndex(notice => notice.id === id);
      if (noticeIndex !== -1) {
        const notice = get().notices[noticeIndex];
        const isCurrentlyLiked = notice.isLiked;

        const revertedNotices = [...get().notices];
        revertedNotices[noticeIndex] = {
          ...notice,
          isLiked: isCurrentlyLiked,
          likes: isCurrentlyLiked ? notice.likes + 1 : notice.likes - 1,
        };
        set({notices: revertedNotices});
      }
    }
  },
}));

export default useNoticeStore;
