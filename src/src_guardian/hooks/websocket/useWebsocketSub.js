import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useWebsocketStore from '../../../store/websocketStore';
import eventEmitter from '../../../utils/eventEmitter';

const useWebSocketSubscription = (groupInfo) => {
  const { subscribeToChannel, unsubscribeToChannel } = useWebsocketStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (groupInfo) {
      const channel = `/sub/group/${groupInfo.id}`;
      const callback = (message) => {
        const newMessage = JSON.parse(message.body);
        console.log(newMessage);

        // 학생 출석 상태 변경
        if (newMessage.messageType === 'ATTENDANCE_CHANGE') {
          const { studentId, attendanceStatus, waypointId } = newMessage;

          // 경유지 정보 업데이트
          queryClient.setQueryData(['waypoints'], (oldData) => {
            if (!oldData) return;
            return oldData.map((waypoint) => {
              if (waypoint.waypointId === waypointId) {
                console.log('Updating waypoint:', waypoint.waypointName);
                return { 
                  ...waypoint, 
                  currentCount: attendanceStatus === 'PRESENT' ? waypoint.currentCount + 1 : waypoint.currentCount - 1 
                };
              }
              return waypoint;
            });
          });

          // 학생 출석 상태 업데이트
          queryClient.setQueryData(['studentList', waypointId], (oldData) => {
            if (!oldData) return;
            return oldData.map((student) => {
              if (student.studentId === studentId) {
                console.log('Updating student:', student.name);
                return { ...student, attendanceStatus };
              }
              return student;
            });
          });
        }

        // 출석 완료 처리
        if (newMessage.messageType === 'ATTENDANCE_COMPLETE') {
          eventEmitter.emit('attendanceComplete', newMessage);
          queryClient.invalidateQueries({ queryKey: ['waypoints'] });
        }

        if (newMessage.messageType === 'GUIDE_STATUS_CHANGE') {
          queryClient.invalidateQueries({ queryKey: ['guideStatus'] });
        }

        if (newMessage.shuttleStatus === true) {
          queryClient.invalidateQueries({ queryKey: ['waypoints'] });
        }
      }
      subscribeToChannel({ channel, callback });
    }
    return () => {
      unsubscribeToChannel();
    };
  }, [groupInfo]);
};

export default useWebSocketSubscription;
