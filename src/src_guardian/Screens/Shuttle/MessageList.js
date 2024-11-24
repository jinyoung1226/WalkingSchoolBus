import { View, Text, Image, TouchableOpacity } from 'react-native';
import SmileIcon from '../../../assets/icons/SmileIcon.svg';
import { textStyles, colors } from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import ArrowIcon from '../../../assets/icons/ArrowIcon.svg';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../../components/CustomButton';
import useStudentMessages from '../../hooks/queries/useStudentMessages';
import MessageItem from '../../../components/MessageItem';
import MessageIcon from '../../../assets/icons/MessageIcon.svg';
const MessageList = ({route}) => {
  const { studentName, studentId, image } = route.params;
  const {data, isSuccess} = useStudentMessages(studentId)

  // const data = [{"content": "우리 아이가 나이가 많아오......", "isRead": false, "messageId": 15, "parent": {"id": 24, "imagePath": null, "name": "김수환"}, "transferredAt": "2024-11-15T05:42:46"}, {"content": "우리 아이가 잠이 많아요.", "isRead": false, "messageId": 14, "parent": {"id": 24, "imagePath": null, "name": "김수환"}, "transferredAt": "2024-11-15T05:42:30"}, {"content": "우리 아이가 잠이 많아요.", "isRead": false, "messageId": 13, "parent": {"id": 24, "imagePath": null, "name": "김수환"}, "transferredAt": "2024-11-15T05:42:28"}, {"content": "저희  아이가 오늘은 진짜 아파요. ㄹㅇㄹㅇㄹㅇ", "isRead": true, "messageId": 12, "parent": {"id": 24, "imagePath": null, "name": "김수환"}, "transferredAt": "2024-11-15T05:12:27"}]
  return (
    <View style={{flex:1, backgroundColor:colors.White_Green}}>
      <CustomHeader title="메시지 목록" />
      {isSuccess && data.length === 0 ? 
      <View style={{flex:1, justifyContent:'center', alignItems:'center', gap:16}}>
        <MessageIcon />
        <Text style={[textStyles.R1, {color:colors.Gray06}]}>아직 받은 메세지가 없어요!</Text>
      </View> 
      :
      <FlatList
        data={data}
        ListHeaderComponent={() => <View style={{height:16}} />}
        keyExtractor={(item) => item.messageId}
        renderItem={({item, index}) => (
          <MessageItem 
            name={`${studentName} 어머니`} 
            imagePath={image}
            receivedAt={item.transferredAt}
            content={item.content}
            isLastMessage={item.isRead == false && data[index+1].isRead == true}
            isRead={item.isRead} 
          />
        )}
      />}
    </View>
  );
};

export default MessageList;
