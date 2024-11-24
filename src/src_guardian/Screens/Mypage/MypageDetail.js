import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {textStyles, colors} from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import {getGuardianInfo} from '../../../api/mypageApi';
import Mypagepencil from '../../../assets/icons/MypagePencil.svg';
import {launchImageLibrary} from 'react-native-image-picker';
import {formDataApi, refreshApi} from '../../../api/api';
import SingleActionModal from '../../../components/SingleActionModal';
import {useModalStore} from '../../../store/modalStore';
import ImageResizer from 'react-native-image-resizer';
import CustomButton from '../../../components/CustomButton';
import {useQueryClient} from '@tanstack/react-query';

const MypageDetail = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {showModal, hideModal} = useModalStore();
  const {guardianInfo} = route.params;
  const [profileImage, setProfileImage] = useState(guardianInfo.imagePath);
  const queryClient = useQueryClient();
  const [tempImagePath, setTempImagePath] = useState(null); // 임시 이미지 경로
  const handleShowModal = selectedImage => {
    showModal(
      <View style={{alignItems: 'center', gap: 32}}>
        <Text style={[textStyles.SB1, {color: colors.Black}]}>
          이미지 미리보기
        </Text>
        <Image
          source={{uri: selectedImage.uri}}
          style={{width: '100%', aspectRatio: 1, borderRadius: 10}}
        />
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <CustomButton
              title={'취소'}
              onPress={hideModal}
              type="cancel"
              textStyle={[textStyles.SB3]}
            />
          </View>
          <View style={{width: 8}} />
          <View style={{flex: 1}}>
            <CustomButton
              title={'변경하기'}
              onPress={() => handleSave(selectedImage)}
              type="confirm"
              textStyle={[textStyles.SB3]}
            />
          </View>
        </View>
      </View>,
    );
  };
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 관리
  // get /guardian API 호출

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
    const resizedImage = await ImageResizer.createResizedImage(
      result.assets[0].uri, // 원본 이미지 경로
      900, // 너비 (원하는 크기로 설정)
      900, // 높이 (원하는 크기로 설정)
      'JPEG', // 포맷 (JPEG, PNG)
      80, // 품질 (1-100)
    );
    handleShowModal(resizedImage);
    console.log(resizedImage);
  };

  const handleSave = async selectedImage => {
    if (!selectedImage) {
      Alert.alert('알림', '변경된 이미지가 없습니다.');
      return;
    }
    const formData = new FormData();
    try {
      formData.append('imageFile', {
        uri: selectedImage.uri,
        type: 'image/jpeg',
        name: selectedImage.name,
      });

      const response = await formDataApi.patch(
        '/guardian/update/imageFile',
        formData,
      );

      if (response.status === 200) {
        console.log('이미지 업로드 성공');
        setModalVisible(true); // 성공 모달 표시
        queryClient.invalidateQueries('guardianInfo');
        setProfileImage(selectedImage.uri);
        hideModal();
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생', error);
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
      />
      <View
        style={{
          alignItems: 'center',
          marginTop: 24,
          position: 'relative',
        }}>
        {/* 프로필 이미지 */}
        <TouchableOpacity
          onPress={handleImagePicker}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}>
          <Image
            source={{uri: profileImage}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.Gray03,
            }}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 0,
              right: 5,
              width: 25,
              height: 25,
              backgroundColor: colors.Gray05,
              borderRadius: 12.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleImagePicker}>
            <Mypagepencil />
          </TouchableOpacity>
        </TouchableOpacity>

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
        <View style={{marginBottom: 32, paddingHorizontal: 16}}>
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
        }}
      />
    </View>
  );
};

export default MypageDetail;
