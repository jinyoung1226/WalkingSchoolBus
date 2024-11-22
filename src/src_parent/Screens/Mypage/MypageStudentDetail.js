import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {textStyles, colors} from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import {getStudentInfo} from '../../../api/mypageApi';
import {launchImageLibrary} from 'react-native-image-picker';
import Mypagepencil from '../../../assets/icons/MypagePencil.svg';
import Student from '../../../assets/icons/Student.svg';
import SingleActionModal from '../../../components/SingleActionModal';
import useStudentStore from '../../../store/mypageStudentStore'; // Zustand 스토어
import {refreshApi} from '../../../api/api';

const MypageDetail = ({navigation}) => {
  const insets = useSafeAreaInsets();

  // Zustand에서 선택된 studentId 가져오기
  const selectedStudentId = useStudentStore(state => state.selectedStudentId);

  const [studentInfo, setStudentInfo] = useState({
    imagePath: '',
    name: '',
    schoolName: '정보 없음',
    grade: '정보 없음',
    notes: '정보 없음',
  });
  const [tempImagePath, setTempImagePath] = useState(null); // 임시 이미지 경로
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

    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setTempImagePath(selectedImage.uri); // 임시 이미지 경로 저장
    }
  };

  const handleSave = async () => {
    if (!tempImagePath) {
      Alert.alert('알림', '변경된 이미지가 없습니다.');
      return;
    }

    try {
      const formData = new FormData();

      // 이미 컴포넌트 최상위 레벨에서 가져온 selectedStudentId를 사용합니다.
      formData.append('studentId', selectedStudentId);

      // imageFile을 formData에 추가합니다.
      formData.append('imageFile', {
        uri: tempImagePath,
        type: 'image/jpeg',
        name: `profile_${Date.now()}.jpg`,
      });

      const response = await refreshApi.patch(
        '/students/update/imageFile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        console.log('이미지 업로드 성공');
        setStudentInfo(prev => ({...prev, imagePath: tempImagePath})); // UI 업데이트
        setTempImagePath(null); // 임시 이미지 초기화
        setModalVisible(true); // 성공 모달 표시
      } else {
        throw new Error('이미지 업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생', error);
      Alert.alert('오류', '이미지 업로드에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (!selectedStudentId) {
        Alert.alert('오류', '학생 정보가 없습니다.');
        navigation.goBack();
        return;
      }

      try {
        const allStudents = await getStudentInfo(); // 모든 학생 정보를 가져옴
        const selectedStudent = allStudents.find(
          student => student.studentId === selectedStudentId,
        );

        if (!selectedStudent) {
          Alert.alert('오류', '학생 정보를 찾을 수 없습니다.');
          navigation.goBack();
          return;
        }

        // 데이터 매핑
        setStudentInfo({
          imagePath: selectedStudent.imagePath || '',
          name: selectedStudent.name,
          schoolName: selectedStudent.schoolName || '정보 없음',
          grade: `${selectedStudent.grade}학년` || '정보 없음',
          notes: selectedStudent.notes || '정보 없음',
        });
      } catch (error) {
        console.error('학생 정보 가져오기 오류:', error);
        Alert.alert('오류', '학생 정보를 불러오지 못했습니다.');
        navigation.goBack();
      }
    };

    fetchStudentInfo();
  }, [selectedStudentId, navigation]);

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
        headerRight={
          <TouchableOpacity onPress={handleSave}>
            <Text style={{color: colors.Black, fontSize: 16}}>저장</Text>
          </TouchableOpacity>
        }
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
          {tempImagePath || studentInfo.imagePath ? (
            <Image
              source={{uri: tempImagePath || studentInfo.imagePath}}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.Gray03,
              }}
            />
          ) : (
            <Student width={100} height={100} />
          )}
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

        <Text style={[textStyles.SB2, {color: colors.Black, marginTop: 16}]}>
          {studentInfo.name}
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
        <View style={{marginBottom: 32, paddingHorizontal: 16}}>
          <Text
            style={[textStyles.M2, {color: colors.Black, marginVertical: 8}]}>
            학교
          </Text>
          <Text style={[textStyles.M3, {color: colors.Gray07}]}>
            {studentInfo.schoolName}
          </Text>

          <Text
            style={[textStyles.M2, {color: colors.Black, marginVertical: 8}]}>
            학년
          </Text>
          <Text style={[textStyles.M3, {color: colors.Gray07}]}>
            {studentInfo.grade}
          </Text>

          <Text
            style={[textStyles.M2, {color: colors.Black, marginVertical: 8}]}>
            특이사항
          </Text>
          <Text style={[textStyles.M3, {color: colors.Gray07}]}>
            {studentInfo.notes}
          </Text>
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
