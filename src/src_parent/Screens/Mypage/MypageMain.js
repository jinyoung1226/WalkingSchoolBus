import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LogOut from '../../../assets/icons/logOut.svg';
import NextIcon from '../../../assets/icons/NextIcon.svg';
import Parents from '../../../assets/icons/Parents.svg';
import {textStyles, colors} from '../../../styles/globalStyle';
import ConfirmModal from '../../../components/ConfirmModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../../store/authStore';
import EncryptedStorage from 'react-native-encrypted-storage';
import ImageResizer from 'react-native-image-resizer';
import {getParentsInfo} from '../../../api/mypageApi';

const MypageMain = ({navigation}) => {
  const {setLogout} = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [resizedImage, setResizedImage] = useState(null);
  const [userName, setUserName] = useState('');

  const logout = async () => {
    try {
      const response = await refreshApi.post('/auth/signOut');
      if (response.status === 200) {
        console.log('로그아웃 성공');
        await AsyncStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        setLogout(false, null, null, null);
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      await AsyncStorage.removeItem('accessToken');
      await EncryptedStorage.removeItem('refreshToken');
      setLogout(false, null, null, null);
    }
  };

  const fetchParentsInfo = async () => {
    try {
      const parentsInfo = await getParentsInfo();
      setUserName(parentsInfo.name);
      // if (parentsInfo.imagePath) {
      //   const resized = await ImageResizer.createResizedImage(
      //     parentsInfo.imagePath,
      //     800,
      //     800,
      //     'JPEG',
      //     80,
      //   );
      //   setResizedImage({
      //     uri: resized.uri,
      //     type: 'image/jpeg',
      //     name: resized.name || `resized_${Date.now()}.jpg`,
      //   });
      // }
    } catch (error) {
      console.error('Parents 정보 가져오기 오류:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchParentsInfo();
    }, []),
  );

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.White}}>
      {/* 상단 섹션 */}
      <View
        style={{
          marginBottom: 32,
          marginTop: 24,
          backgroundColor: colors.White,
          paddingHorizontal: 32,
          height: 70,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Parents width={70} height={70} style={{marginRight: 32}} />
          <View>
            <Text style={[textStyles.B1, {color: colors.Black}]}>
              {userName} 님
            </Text>
          </View>
          <View
            style={{
              padding: 8,
              position: 'absolute',
              right: 0,
            }}>
            <NextIcon onPress={() => navigation.navigate('MypageDetail')} />
          </View>
        </View>
      </View>

      {/* 그룹 섹션 */}
      <View style={{marginBottom: 32, paddingHorizontal: 32}}>
        <Text style={[textStyles.SB2, {color: colors.Black, marginBottom: 16}]}>
          나의 자녀
        </Text>
        <View
          style={{
            backgroundColor: colors.White,
            padding: 24,
            borderRadius: 10,
            shadowColor: colors.Black,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Text
            style={[textStyles.M4, {color: colors.Gray06, marginBottom: 8}]}>
            2024년 2학기
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 60,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>
          </View>
        </View>
      </View>

      <View
        style={{width: '100%', height: 8, backgroundColor: colors.Gray01}}
      />
      <View
        style={{width: '100%', height: 32, backgroundColor: colors.White}}
      />
      <View style={{paddingHorizontal: 32}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.White,
          }}
          onPress={handleLogoutPress}>
          <LogOut width={25} height={25} style={{marginRight: 8}} />
          <Text style={[textStyles.SB2, {color: colors.Black}]}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="로그아웃"
        subtitle={
          <Text style={{textAlign: 'center'}}>정말 로그아웃하시나요?</Text>
        }
        cancelTitle={'취소'}
        onCancel={() => {
          setModalVisible(false);
        }}
        confirmTitle="확인"
        icon={<LogOut width={40} height={40} />}
        isBackgroundclosable={false}
        onConfirm={async () => {
          try {
            await logout();
            setModalVisible(false);
            console.log('로그아웃 완료');
          } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
          }
        }}
      />
    </View>
  );
};

export default MypageMain;
