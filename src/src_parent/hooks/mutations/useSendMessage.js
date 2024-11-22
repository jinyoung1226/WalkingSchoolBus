import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '../../../api/shuttleApi';

const useSendMessage = () => {
  return useMutation({
    mutationFn: ({ studentId, content }) => sendMessage({studentId, content}),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error.response.data.message, '메시지 전송 에러');
    },
  });
};

export default useSendMessage;