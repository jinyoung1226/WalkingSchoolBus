import { create } from 'zustand';

const useNoticeStore = create((set) => ({
  notices: [], // 공지 리스트 상태
  error: null, // fetch 요청 시의 오류 상태

  // 공지 리스트를 설정하는 함수
  setNotices: (newNotices) => set({ notices: newNotices }),

  // 특정 공지의 좋아요 토글 함수
  toggleLike: (id) => set((state) => ({
    notices: state.notices.map((notice) =>
      notice.id === id
        ? { ...notice, isLiked: !notice.isLiked, likes: notice.isLiked ? notice.likes - 1 : notice.likes + 1 }
        : notice
    ),
  })),

  // 공지 리스트 데이터를 서버에서 가져오는 함수 (fetch)
  fetchNotices: async () => {
    try {
      const response = await fetch('https://api.example.com/notices');
      const data = await response.json();
      set({ notices: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch notices' });
    }
  },

  // 공지를 비우는 함수
  clearNotices: () => set({ notices: [] }),
}));

export default useNoticeStore;
