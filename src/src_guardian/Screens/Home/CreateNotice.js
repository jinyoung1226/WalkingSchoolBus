import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {useNavigation} from '@react-navigation/native';
import CameraIcon from '../../../assets/icons/Camera.svg';
import NoticeXCircle from '../../../assets/icons/NoticeXCircle.svg';
import SingleActionModal from '../../../components/SingleActionModal';
import CheckIcon from '../../../assets/icons/CheckIcon.svg';
import {createNotice} from '../../../api/noticeApi';
import {useQueryClient} from '@tanstack/react-query';

const CreateNotice = () => {
  const [images, setImages] = useState([]); // 리사이즈된 이미지
  const [noticeContent, setNoticeContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  // 이미지 선택 및 리사이즈 처리
  const selectImages = () => {
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 10},
      async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
        } else {
          try {
            const resizedPhotosPromises = response.assets.map(async image => {
              const resizedImage = await ImageResizer.createResizedImage(
                image.uri, // 원본 이미지 경로
                800, // 너비 (설정 값)
                800, // 높이 (설정 값)
                'JPEG', // 포맷
                80, // 품질 (0-100)
              );
              return {
                uri: resizedImage.uri,
                type: 'image/jpeg',
                name: resizedImage.name || `resized_${Date.now()}.jpg`,
              };
            });

            const resizedPhotos = await Promise.all(resizedPhotosPromises);
            setImages(prevImages => [...prevImages, ...resizedPhotos]);
          } catch (error) {
            console.error('Error resizing images:', error);
            Alert.alert('Error', '이미지 리사이즈 중 오류가 발생했습니다.');
          }
        }
      },
    );
  };

  // 이미지 삭제
  const photoDelete = index => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // 공지 작성
  const handleSubmit = async () => {
    try {
      await createNotice(noticeContent, images);
      queryClient.invalidateQueries(['notices']);
      setModalVisible(true);
    } catch (error) {
      console.error('Error uploading notice:', error);
      Alert.alert('Error', '서버와의 연결에 실패했습니다.');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#feffff', paddingHorizontal: 16}}>
      <SingleActionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="공지 등록 완료"
        subtitle={<Text>공지글이 성공적으로 등록되었습니다.</Text>}
        confirmTitle="확인"
        icon={<CheckIcon />}
        isBackgroundclosable={false}
        onConfirm={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
      />

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

              {index === 0 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: 80,
                    height: 22,
                    borderBottomLeftRadius: 7,
                    borderBottomRightRadius: 7,
                    backgroundColor: '#000',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '500',
                      textAlign: 'center',
                      color: '#fff',
                    }}>
                    대표 사진
                  </Text>
                </View>
              )}

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
