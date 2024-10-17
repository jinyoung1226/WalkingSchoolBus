import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraIcon from '../../../assets/icons/Camera.svg';
import NoticeXCircle from '../../../assets/icons/NoticeXCircle.svg'; // X 아이콘 추가

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
    launchImageLibrary({mediaType: 'photo', selectionLimit: 10}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else {
        setImages(response.assets || []); // 선택한 이미지를 상태에 저장
      }
    });
  };

  // 사진 삭제 함수
  const photoDelete = index => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
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
    images.forEach(image => {
      formData.append('photos', {
        uri: image.uri.startsWith('file://')
          ? image.uri
          : `file://${image.uri}`,
        name: image.fileName || `photo.${image.type.split('/')[1]}`,
        type: image.type,
      });
    });

    try {
      const response = await axios.post(
        'https://walkingschoolbus.store/group-notices',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', '공지가 등록되었습니다.');
        navigation.goBack(); // 이전 화면으로 돌아갑니다.
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
    <View style={{flex: 1, backgroundColor: '#feffff', paddingHorizontal: 16}}>
      {/* Camera Icon Section */}
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        <TouchableOpacity
          style={{
            width: 80,
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 7,
            borderWidth: 1,
            borderColor: '#d9d9d9',
            marginRight: 10,
          }}
          onPress={selectImages}>
          <CameraIcon width={30} height={30} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#bdbdbd',
              marginTop: 8,
            }}>
            {`${images.length}/10`}
          </Text>
        </TouchableOpacity>

        {/* 이미지 미리보기 섹션 */}
        <FlatList
          horizontal
          data={images}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={{position: 'relative', marginRight: 10, zIndex: 1}}>
              <Image
                source={{uri: item.uri}}
                style={{
                  marginTop: 3,
                  width: 80,
                  height: 80,
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: '#d9d9d9',
                }}
              />

              {/* 첫 번째 이미지에만 요소를 덮음 */}
              {index === 0 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0, // 이미지 하단에 고정
                    width: 80,
                    height: 22,
                    borderBottomLeftRadius: 7,
                    borderBottomRightRadius: 7,
                    backgroundColor: '#000', // background -> backgroundColor로 변경
                    justifyContent: 'center', // 텍스트 수직 중앙 정렬
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '500', // fontWeight는 문자열로 설정
                      textAlign: 'center',
                      color: '#fff',
                    }}>
                    대표 사진
                  </Text>
                </View>
              )}

              {/* 사진 삭제 아이콘 */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -5,
                  backgroundColor: 'transparent',
                  zIndex: 9999,
                }}
                onPress={() => photoDelete(index)}>
                <NoticeXCircle width={20} height={20} />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{flexDirection: 'row', alignItems: 'center'}}
        />
      </View>

      {/* 글 작성 섹션 */}
      <View style={{marginTop: 16}}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#000',
            marginBottom: 8,
          }}>
          글 작성
        </Text>
        <View
          style={{
            height: 191,
            padding: 16,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e9e9e9',
            justifyContent: 'center',
          }}>
          <TextInput
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: '500',
              color: '#000',
              textAlignVertical: 'top',
            }}
            placeholder="공지할 내용을 작성해주세요. 공지글을 업로드하면 그룹의 모든 보호자들에게 공지 알림이 전송됩니다."
            placeholderTextColor="#bdbdbd"
            multiline
            numberOfLines={6}
            value={noticeContent}
            onChangeText={setNoticeContent}
          />
        </View>
      </View>

      {/* 하단 버튼 */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '108.4%',
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            backgroundColor: noticeContent.trim() ? '#2ee8a5' : '#f4f4f4',
          }}
          disabled={!noticeContent.trim()}
          onPress={handleSubmit}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: noticeContent.trim() ? '#fff' : '#8a8a8a',
            }}>
            작성 완료
          </Text>
        </TouchableOpacity>
        <View style={{height: 16}} />
      </View>
    </View>
  );
};

export default CreateNotice;
