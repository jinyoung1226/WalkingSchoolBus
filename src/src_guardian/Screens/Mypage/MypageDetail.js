import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {textStyles, colors} from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import {getGuardianInfo} from '../../../api/mypageApi';
import Mypagepencil from '../../../assets/icons/MypagePencil.svg';
import {launchImageLibrary} from 'react-native-image-picker';
import {refreshApi} from '../../../api/api';
import SingleActionModal from '../../../components/SingleActionModal';

const MypageDetail = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [guardianInfo, setGuardianInfo] = useState({
    imagePath: '',
    name: '',
    phone: '정보 없음',
    email: '정보 없음',
  });
  const [tempImagePath, setTempImagePath] = useState(null); // 임시 이미지 경로
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 관리

  // get /guardian API 호출
  useEffect(() => {
    const fetchGuardianInfo = async () => {
      const data = await getGuardianInfo();
      setGuardianInfo({
        imagePath: data.imagePath,
        name: data.name,
        phone: data.phone || '정보 없음',
        email: data.id ? `${data.id}@example.com` : '정보 없음',
      });
    };
    fetchGuardianInfo();
  }, []);

  // 이미지 선택
  const handleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.didCancel) {
      console.log('이미지 선택 취소');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setTempImagePath(selectedImage.uri); // 임시 이미지 경로 저장
    }
  };

  // 저장 버튼 클릭 시 이미지 업로드
  const handleSave = async () => {
    if (!tempImagePath) {
      Alert.alert('알림', '변경된 이미지가 없습니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('imageFile', {
        uri: tempImagePath,
        type: 'image/jpeg',
        name: `profile_${Date.now()}.jpg`,
      });

      const response = await refreshApi.patch(
        '/guardian/update/imageFile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        console.log('이미지 업로드 성공');
        setGuardianInfo({...guardianInfo, imagePath: tempImagePath}); // 저장된 이미지 업데이트
        setTempImagePath(null); // 임시 이미지 초기화
        setModalVisible(true); // 성공 모달 표시
      } else {
        throw new Error('이미지 업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
      Alert.alert('오류', '이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 16,
        backgroundColor: '#feffff',
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}>
      <CustomHeader
        title="프로필 설정"
        onBackPress={() => navigation.goBack()} // 뒤로가기 버튼 처리
        headerRight={
          <TouchableOpacity onPress={handleSave}>
            <Text style={{color: colors.Black, fontSize: 16}}>저장</Text>
          </TouchableOpacity>
        }
      />
      {/* 프로필 정보 섹션 */}
      <View
        style={{
          alignItems: 'center',
          marginTop: 24,
          position: 'relative',
        }}>
        {/* 프로필 이미지 */}
        <View
          style={{
            position: 'relative',
          }}>
          <Image
            source={{uri: tempImagePath || guardianInfo.imagePath}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.Gray03,
            }}
          />
          {/* 펜슬 아이콘 */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: 25,
              height: 25,
              right: 5,
              bottom: 0,
            }}
            onPress={handleImagePicker}>
            <Mypagepencil width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 이름 */}
        <Text style={[textStyles.SB2, {color: colors.Black, marginTop: 16}]}>
          {guardianInfo.name}
        </Text>
      </View>

      {/* 상세 정보 */}
      <View>
        <Text
          style={[
            textStyles.R3,
            {color: colors.Gray06, marginVertical: 32, paddingHorizontal: 16},
          ]}>
          그룹 정보에 공개되어 학부모가 볼 수 있는 정보입니다
        </Text>
        {/* 휴대폰 번호 */}
        <View style={{marginBottom: 16, paddingHorizontal: 16}}>
          <Text
            style={[textStyles.SB3, {color: colors.Black, marginBottom: 4}]}>
            휴대폰 번호
          </Text>
          <Text style={[textStyles.M3, {color: colors.Gray06}]}>
            {guardianInfo.phone}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: 8,
            backgroundColor: colors.Gray01,
          }}
        />
        <Text
          style={[
            textStyles.R3,
            {
              color: colors.Gray06,
              marginTop: 32,
              marginBottom: 16,
              paddingHorizontal: 16,
            },
          ]}>
          공개되지 않는 정보입니다
        </Text>
        {/* 이메일 */}
        <View style={{paddingHorizontal: 16}}>
          <Text
            style={[textStyles.SB3, {color: colors.Black, marginBottom: 4}]}>
            이메일
          </Text>
          <Text style={[textStyles.M3, {color: colors.Gray06}]}>
            {guardianInfo.email}
          </Text>
        </View>
      </View>

      {/* SingleActionModal */}
      <SingleActionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="내 정보 수정 완료"
        subtitle="성공적으로 정보가 수정되었어요!"
        confirmTitle="확인"
        onConfirm={async () => {
          setModalVisible(false); // 모달 닫기
          navigation.goBack(); // 이전 페이지로 이동
        }}
      />
    </View>
  );
};

export default MypageDetail;
