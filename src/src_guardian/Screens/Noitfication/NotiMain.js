import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { colors, textStyles } from '../../../styles/globalStyle';
import { authApi } from '../../../api/api';
import { FlatList } from 'react-native-gesture-handler';
import MessageIcon from '../../../assets/icons/NoticeMessageIcon.svg';
import CustomHeader from '../../../components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MessageIcon2 from '../../../assets/icons/MessageIcon.svg';




const NotiMain = () => {
  const [alertList, setAlertList] = useState([]);
  const insets = useSafeAreaInsets();

  // 알림 센터 내용 불러오는 api
  useEffect(() => {
    const getAlertList = async () => {
      try {
        const response = await authApi.get('alert');
        if (response.status === 200) {
          console.log(response.data,"@@@")
          setAlertList(response.data);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            Alert.alert('알림 리스트를 불러올 수 없습니다.');
          }
        } else {
          console.log(error);
          Alert.alert('서버와의 통신 실패');
        }
      }
    };
    getAlertList();
  }, []);

  // 시간 계산 로직
  const formatDate = createdAt => {
    try {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const daysDifference = Math.floor(
        (now - createdDate) / (1000 * 60 * 60 * 24),
      );
  
      if (daysDifference < 1) {
        const minutesDifference = Math.floor((now - createdDate) / (1000 * 60));
        if (minutesDifference < 60) {
          return `${minutesDifference}분 전`;
        }
        const hoursDifference = Math.floor(minutesDifference / 60);
        return `${hoursDifference}시간 전`;
      } else if (daysDifference === 1) {
        return '어제';
      } else {
        const month = createdDate.getMonth() + 1;
        const day = createdDate.getDate();
        return `${month}/${day}`;
      }
    } catch (error) {
      console.error('Invalid date format:', createdAt);
      return '';
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 32, justifyContent: 'center', backgroundColor: item.read ? 'transparent' : 'rgba(77, 237, 180, 0.06)'}}>
      <View style={{ flexDirection: 'row' }}>
        <MessageIcon />
        <View style={{flex:1, marginHorizontal:16, gap:8}}>
          <Text style={[textStyles.SB2, {color:colors.Black}]}>{item.title}</Text>
          <Text style={[textStyles.R2, {color:colors.Black}]}>{item.content}</Text>
        </View>
        <Text style={[textStyles.M4, {color:colors.Gray06}]}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={{height:8}} />
    </View>
  )
  

  return (
    <View style={{ flex: 1, backgroundColor: colors.White, paddingBottom: insets.bottom, paddingTop: insets.top }}>
      <CustomHeader
        title="알림 센터"
        headerRight={
          <TouchableOpacity
            style={{paddingHorizontal: 10}}>
          </TouchableOpacity>
        }
      />
      {alertList.length == 0 ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <MessageIcon2 />
          <Text style={[textStyles.R1, {color:colors.Gray06}]}>아직 받은 알림이 없어요!</Text>
        </View> :
        <FlatList
        data={alertList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={() => (
          <Text style={[textStyles.M3, { color: colors.Gray06 ,marginTop:64, textAlign:'center'}]}>
            알림은 최대 3개월까지 저장됩니다
          </Text>
        )}
      />
        }
      
    </View>
  );
};

export default NotiMain;