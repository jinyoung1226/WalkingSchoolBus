import {create} from 'zustand';

// 운행 중(경유지, 학생 출석 상태.. 등) 상태 관리 store
const useShuttleStore = create(set => ({
  // 경유지 상태 관리
  waypoints: [],

  // 경유지 정보 설정
  setWaypoints: waypoints => set({waypoints}),

  //   // 학생 출석 상태(0:미출석, 1:출석) 설정 - 잠시 생각중..
  //   markAttendance: waypointId =>
  //     set(state => ({
  //       waypoints: state.waypoints.map(waypoint =>
  //         waypoint.waypointId === waypointId
  //           ? {...waypoint, attendance: waypoint.attendance + 1}
  //           : waypoint,
  //       ),
  //     })),
}));

export default useShuttleStore;
