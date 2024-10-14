import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraIcon from '../../../assets/icons/Camera.svg';

const CreateNotice = () => {
  const [images, setImages] = useState([]);
  const [noticeContent, setNoticeContent] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const navigation = useNavigation();

  // 액세스 토큰 가져오기
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setAccessToken(token);
        } else {
          Alert.alert('Error', '로그인이 필요합니다.');
          navigation.navigate('Login'); // 로그인 화면으로 이동
        }
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    fetchAccessToken();
  }, [navigation]);

  // 이미지 선택 함수
  const selectImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 10, // 최대 10장 선택 가능
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
        } else {
          const selectedImages = response.assets || [];
          setImages(selectedImages); // 선택한 이미지를 상태에 저장
        }
      },
    );
  };

  // 공지 작성 완료 함수
  const handleSubmit = async () => {
    if (!accessToken) {
      Alert.alert('Error', '토큰을 가져오지 못했습니다. 다시 로그인 해주세요.');
      return;
    }

    // FormData 생성
    const formData = new FormData();
    formData.append('content', noticeContent);

    // 선택한 모든 이미지를 formData에 추가 (필드명은 'photos')
    images.forEach((image) => {
      const imageUri = image.uri.startsWith('file://')
        ? image.uri
        : `file://${image.uri}`;
      formData.append('photos', {
        uri: imageUri,
        name: image.fileName || `photo.${image.type.split('/')[1]}`, // 파일 이름 지정
        type: image.type,
      });
    });

    try {
      // POST 요청 보내기 (axios 사용)
      const response = await axios.post(
        'https://walkingschoolbus.store/group-notices',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // 서버 응답이 성공적일 경우
      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        console.log('서버 응답 데이터:', responseData); // 서버 응답 로그
        Alert.alert('공지가 등록되었습니다.');
        navigation.navigate('GroupNotice');
      } else {
        Alert.alert(
          'Error',
          `공지 작성에 실패했습니다. 상태 코드: ${response.status}`,
        );
      }
    } catch (error) {
      console.error('Error uploading notice:', error);
      Alert.alert('Error', '서버와의 연결에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera Icon Section */}
      <View style={styles.cameraContainer}>
        <TouchableOpacity style={styles.cameraBox} onPress={selectImages}>
          <CameraIcon width={30} height={30} />
          <Text style={styles.cameraText}>{`${images.length}/10`}</Text>
        </TouchableOpacity>
      </View>

      {/* 글 작성 섹션 */}
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>글 작성</Text>
        <View style={styles.textBox}>
          <TextInput
            style={styles.textInput}
            placeholder="공지할 내용을 작성해주세요. 공지글을 업로드하면 그룹의 모든 보호자들에게 공지 알림이 전송됩니다."
            placeholderTextColor="#bdbdbd" // Placeholder 색상
            multiline
            numberOfLines={6}
            value={noticeContent}
            onChangeText={setNoticeContent}
          />
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            noticeContent.trim() ? styles.activeButton : styles.inactiveButton,
          ]}
          disabled={!noticeContent.trim()} // 텍스트가 없으면 비활성화
          onPress={handleSubmit} // 작성 완료 시 handleSubmit 호출
        >
          <Text
            style={[
              styles.submitButtonText,
              noticeContent.trim() ? styles.activeText : styles.inactiveText,
            ]}>
            작성 완료
          </Text>
        </TouchableOpacity>
        <View style={styles.footerIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#feffff',
    paddingHorizontal: 16,
  },
  cameraContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  cameraBox: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  cameraText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#bdbdbd',
    marginTop: 8,
  },
  contentContainer: {
    marginTop: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textBox: {
    height: 191,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9e9e9',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000', // 입력 텍스트 색상
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16,
  },
  submitButton: {
    width: 358,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#2ee8a5', // 텍스트가 있을 때 활성화된 버튼 색상
  },
  inactiveButton: {
    backgroundColor: '#f4f4f4', // 텍스트가 없을 때 비활성화된 버튼 색상
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: '500',
  },
  activeText: {
    color: '#fff', // 활성화된 상태에서의 텍스트 색상
  },
  inactiveText: {
    color: '#8a8a8a', // 비활성화된 상태에서의 텍스트 색상
  },
});

export default CreateNotice;
