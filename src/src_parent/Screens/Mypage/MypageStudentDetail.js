import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {textStyles, colors} from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import {launchImageLibrary} from 'react-native-image-picker';
import Mypagepencil from '../../../assets/icons/MypagePencil.svg';
import Student from '../../../assets/icons/Student.svg';
import SingleActionModal from '../../../components/SingleActionModal';
import {authApi, formDataApi, refreshApi} from '../../../api/api';
import ImageResizer from 'react-native-image-resizer';
import {useModalStore} from '../../../store/modalStore';
import CustomButton from '../../../components/CustomButton';
import {useQueryClient} from '@tanstack/react-query';

const MypageDetail = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {student} = route.params;

  const {showModal, hideModal} = useModalStore();
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState(student.imagePath);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(student.notes);
  const [studentNote, setStudentNote] = useState(student.notes);
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
      // 이미 컴포넌트 최상위 레벨에서 가져온 selectedStudentId를 사용합니다.
      formData.append('studentId', student.studentId);
      // imageFile을 formData에 추가합니다.
      formData.append('imageFile', {
        uri: selectedImage.uri,
        type: 'image/jpeg',
        name: selectedImage.name,
      });

      const response = await formDataApi.patch(
        '/students/update/imageFile',
        formData,
      );

      if (response.status === 200) {
        console.log('이미지 업로드 성공');
        setModalVisible(true); // 성공 모달 표시
        queryClient.invalidateQueries('students'); // 쿼리 다시 불러오기
        setProfileImage(selectedImage.uri);
        hideModal();
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생', error);
      Alert.alert('오류', '이미지 업로드에 실패했습니다.');
    }
  };

  const MyInfoItem = ({title, content}) => (
    <View style={{gap: 16}}>
      <Text style={[textStyles.M2, {color: colors.Black}]}>{title}</Text>
      <Text style={[textStyles.M3, {color: colors.Gray07, margin: 16}]}>
        {content}
      </Text>
    </View>
  );

  const editStudentNote = async () => {
    try {
      const response = await authApi.patch('/students/update/notes', {
        studentId: student.studentId,
        notes: studentNote,
      });
      if (response.status == 200) {
        setIsEditing(false);
        Alert.alert('변경완료');
        setEditedNote(studentNote);
        queryClient.invalidateQueries('students');
      }
    } catch (error) {
      console.error('변경오류', error);
      Alert.alert('오류', '변경오류');
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
        title="자녀 프로필 수정"
        onBackPress={() => navigation.goBack()}
      />
      <View
        style={{
          alignItems: 'center',
          marginTop: 24,
          position: 'relative',
        }}>
        <View
          style={{
            position: 'relative',
          }}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.Gray03,
                overflow: 'hidden',
              }}>
              {profileImage !== null ? (
                <Image source={{uri: profileImage}} style={{flex: 1}} />
              ) : (
                <Student width={100} height={100} />
              )}
            </View>
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
        </View>
        <Text style={[textStyles.SB2, {color: colors.Black, marginTop: 16}]}>
          {student.name}
        </Text>
      </View>
      <View>
        <Text
          style={[
            textStyles.R3,
            {color: colors.Gray06, marginVertical: 32, paddingHorizontal: 16},
          ]}>
          지도사에게만 공개되는 정보입니다.
        </Text>
        <View style={{paddingHorizontal: 16, gap: 32}}>
          <MyInfoItem title="학교" content={student.schoolName} />
          <MyInfoItem title="학년" content={`${student.grade}학년`} />
          {student.notes.length == 0 || isEditing ? (
            <View style={{gap: 16}}>
              <Text style={[textStyles.M2, {color: colors.Black}]}>
                {'특이사항'}
              </Text>

              <View
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.Gray03,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <TextInput
                  style={[textStyles.M4, {color: colors.Gray07, flex: 1}]}
                  placeholderTextColor={colors.Gray05}
                  placeholder="특이사항을 입력해주세요"
                  multiline={true}
                  value={studentNote}
                  onChangeText={setStudentNote}
                />
                <TouchableOpacity
                  style={{padding: 4}}
                  onPress={() => {
                    editStudentNote();
                  }}>
                  <Text style={[textStyles.M4, {color: colors.Gray07}]}>
                    등록
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{gap: 16}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[textStyles.M2, {color: colors.Black}]}>
                  {'특이사항'}
                </Text>
                <View style={{flex: 1}} />
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.Gray02,
                    borderRadius: 100,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                  }}
                  onPress={() => setIsEditing(true)}>
                  <Text style={[textStyles.M5, {color: colors.Gray06}]}>
                    수정
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[textStyles.M3, {color: colors.Gray07, margin: 16}]}>
                {editedNote}
              </Text>
            </View>
          )}
        </View>
      </View>
      <SingleActionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="저장 완료"
        subtitle="프로필 이미지가 업데이트되었습니다."
        confirmTitle="확인"
        onConfirm={() => setModalVisible(false)}
      />
    </View>
  );
};

export default MypageDetail;
