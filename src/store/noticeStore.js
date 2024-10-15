// ../store/noticeStore.js
import create from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BASE_URL = 'https://walkingschoolbus.store';

const useNoticeStore = create((set, get) => ({
  notices: [], // 공지 리스트 상태
  error: null, // fetch 요청 시의 오류 상태
  hasNextPage: true, // To track if more data is available

  // 공지 리스트를 설정하는 함수
  setNotices: (newNotices) => {
    console.log('Setting notices:', newNotices);
    set({ notices: newNotices });
  },

  // 공지를 비우는 함수
  clearNotices: () => set({ notices: [] }),

  // 공지 리스트 데이터를 서버에서 가져오는 함수 (fetch)
  fetchNotices: async (pageToLoad = 0, size = 10) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Retrieved access token:', token);

      if (!token) {
        console.error('Access token is missing');
        Alert.alert('Error', '로그인이 필요합니다.');
        // Optionally, navigate to login if needed
        return;
      }

      const authHeader = `Bearer ${token}`;
      console.log('Authorization header:', authHeader);

      const response = await axios.get(
        `${BASE_URL}/group-notices?page=${pageToLoad}&size=${size}&sort=createdAt,desc`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        }
      );

      console.log('Response status:', response.status);
      console.log('Full Response Data:', JSON.stringify(response.data, null, 2));

      if (response.status === 200) {
        // Validate response structure
        if (!Array.isArray(response.data.content)) {
          throw new Error('Invalid data format: content is not an array');
        }

        // Transform and validate notices
        const transformedNotices = response.data.content
          .map((notice, index) => {
            if (!notice || !notice.groupNoticeId) {
              console.warn(
                `Notice at index ${index} is missing groupNoticeId or is undefined:`,
                notice
              );
              return null; // Exclude invalid notices
            }
            return {
              id: notice.groupNoticeId,
              content: notice.content || '',
              photos: Array.isArray(notice.photos) ? notice.photos : [],
              likes: typeof notice.likes === 'number' ? notice.likes : 0,
              createdAt: notice.createdAt || '',
              authorName: notice.guardian?.name || '작성자',
              authorImage: notice.guardian?.imagePath || '',
              isLiked: notice.isLiked || false, // Ensure isLiked is present
            };
          })
          .filter((notice) => notice !== null); // Remove null entries

        console.log('Transformed Notices Count:', transformedNotices.length);
        console.log('Transformed Notices:', transformedNotices);

        // Optimistically sort the notices in descending order by createdAt
        const sortedNotices = transformedNotices.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Descending order
        });

        // Update state with new notices
        if (pageToLoad === 0) {
          set({ notices: sortedNotices });
        } else {
          set((state) => ({ notices: [...state.notices, ...sortedNotices] }));
        }

        // Determine if more pages are available
        if (typeof response.data.last !== 'undefined') {
          set({ hasNextPage: !response.data.last });
        } else if (typeof response.data.totalPages !== 'undefined') {
          set({ hasNextPage: pageToLoad + 1 < response.data.totalPages });
        } else {
          // Fallback: if less than requested size, assume no more pages
          set({ hasNextPage: transformedNotices.length === size });
        }

        set({ error: null }); // Clear any previous errors
      } else {
        console.error('Failed to fetch notices, status code:', response.status);
        set({ error: `Failed to fetch notices, status code: ${response.status}` });
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      set({ error: '공지사항을 불러오는 중 오류가 발생했습니다.' });
    }
  },

  // 특정 공지의 좋아요 토글 함수
  toggleLike: async (id) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('Access token is missing');
        Alert.alert('Error', '로그인이 필요합니다.');
        // Optionally, navigate to login if needed
        return;
      }

      const authHeader = `Bearer ${token}`;
      console.log('Authorization header:', authHeader);

      // Find the notice in the current state
      const noticeIndex = get().notices.findIndex((notice) => notice.id === id);
      if (noticeIndex === -1) {
        console.error('Notice not found in the store:', id);
        return;
      }

      const notice = get().notices[noticeIndex];
      const isCurrentlyLiked = notice.isLiked;

      // Optimistically update the UI
      const updatedNotices = [...get().notices];
      updatedNotices[noticeIndex] = {
        ...notice,
        isLiked: !isCurrentlyLiked,
        likes: isCurrentlyLiked ? notice.likes - 1 : notice.likes + 1,
      };
      set({ notices: updatedNotices });

      // Define the backend endpoint for liking/unliking
      const endpoint = `${BASE_URL}/group-notices/${id}/like`;

      if (!isCurrentlyLiked) {
        // Like the notice
        const response = await axios.post(
          endpoint,
          {}, // Assuming no body is required
          {
            headers: {
              Accept: 'application/json',
              Authorization: authHeader,
            },
          }
        );
      } else {
        const response = await axios.delete(endpoint, {
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', '좋아요를 처리하는 중 오류가 발생했습니다.');

      // Revert the optimistic update in case of an error
      const noticeIndex = get().notices.findIndex((notice) => notice.id === id);
      if (noticeIndex !== -1) {
        const notice = get().notices[noticeIndex];
        const isCurrentlyLiked = notice.isLiked;

        const revertedNotices = [...get().notices];
        revertedNotices[noticeIndex] = {
          ...notice,
          isLiked: isCurrentlyLiked, // Revert to original state
          likes: isCurrentlyLiked ? notice.likes + 1 : notice.likes - 1,
        };
        set({ notices: revertedNotices });
      }
    }
  },
}));

export default useNoticeStore;
