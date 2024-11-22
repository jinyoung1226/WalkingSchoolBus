import {create} from 'zustand';

const useStudentStore = create(set => ({
  selectedStudentId: null, // 선택된 studentId 초기값
  setSelectedStudentId: id => set({selectedStudentId: id}), // studentId 업데이트
  resetSelectedStudentId: () => set({selectedStudentId: null}), // studentId 초기화
}));

export default useStudentStore;
