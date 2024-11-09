import { View, Text, Image, TouchableOpacity } from 'react-native';
import SmileIcon from '../../../assets/icons/SmileIcon.svg';
import { textStyles, colors } from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import ArrowIcon from '../../../assets/icons/ArrowIcon.svg';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../../components/CustomButton';
import useStudentMessages from '../../hooks/queries/useStudentMessages';
import MessageItem from '../../../components/MessageItem';

const MessageList = ({route}) => {
  const { studentName } = route.params;
  const {data, isPending} = useStudentMessages()
  return (
    <View style={{flex:1, backgroundColor:colors.White_Green}}>
      <CustomHeader title="메시지 목록" />
      <FlatList
        scroll
        data={data}
        ItemSeparatorComponent={(leadingItem, trailingItem) => 
          leadingItem?.isRead === false && trailingItem?.isRead === true ? 
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ color: colors.Gray, fontSize: 14 }}>
              이전 메시지
            </Text>
          </View> 
          : 
          <View style={{height: 16}} />}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <MessageItem 
            name={`${studentName} 어머니`} 
            imagePath={item.imagePath}
            receivedAt={item.transferredAt}
            content={item.content}
          />
        )}
      />
    </View>
  );
};

export default MessageList;
