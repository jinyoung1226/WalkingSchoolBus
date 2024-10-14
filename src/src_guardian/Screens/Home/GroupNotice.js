import React, { useEffect } from 'react';
import { Button, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import NoticeItem from '../../../components/NoticeComponent';
import useNoticeStore from '../../../store/noticeStore';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupNotice = ({ navigation }) => {
  // Zustand에서 상태와 설정 함수 가져오기
  const { notices, setNotices } = useNoticeStore();

  // 로딩 및 에러 상태 관리
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // 실제 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Retrieved access token:', token);

        if (!token) {
          console.error('Access token is missing');
          Alert.alert('Error', '로그인이 필요합니다.');
          navigation.navigate('Login'); // 로그인 화면으로 이동
          return;
        }

        // Authorization 헤더 확인
        const authHeader = `Bearer ${token}`;
        console.log('Authorization header:', authHeader);

        // GET 요청 보내기
        const response = await axios.get('https://walkingschoolbus.store/group-notices?page=5&size=9', {
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        if (response.status === 200) {
          // 서버에서 받아온 데이터를 NoticeItem에서 사용하기 편하도록 변환
          const transformedNotices = response.data.content.map((notice) => ({
            id: notice.groupNoticeId,
            content: notice.content,
            photos: notice.photos, // photos는 배열입니다.
            likes: notice.likes,
            createdAt: notice.createdAt,
            authorName: notice.guardian.name || '작성자', // guardian에서 이름 가져오기
            authorImage: notice.guardian.imagePath, // 프로필 이미지
            isLiked: false, // 서버 응답에 isLiked가 없으므로 기본값 설정
          }));

          console.log('Transformed Notices:', transformedNotices);

          // 상태에 실제 데이터를 설정
          setNotices(transformedNotices);
          setLoading(false);
        } else {
          console.error('Failed to fetch notices, status code:', response.status);
          setError(`Failed to fetch notices, status code: ${response.status}`);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchNotices();
  }, [setNotices, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ee8a5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="다시 시도" onPress={() => {
          setLoading(true);
          setError(null);
          // 다시 fetchNotices 함수를 호출하기 위해 navigation.replace 사용
          navigation.replace('GroupNotice');
        }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button 
        title="공지글 쓰기" 
        onPress={() => navigation.navigate('CreateNotice')} 
      />

      {/* 공지 아이템 목록 표시 */}
      {notices.map((notice) => (
        <View key={notice.id}>
          <NoticeItem notice={notice} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16, // 헤더와 16px 거리
    paddingHorizontal: 16,
    backgroundColor: '#feffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default GroupNotice;
