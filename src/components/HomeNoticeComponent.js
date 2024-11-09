import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import {fetchNotices} from '../api/noticeApi'; // fetchNotices 함수 가져오기
import NoticeItem from '../components/NoticeItem'; // 간소화된 NoticeItem 컴포넌트 가져오기

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

const HomeNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const response = await fetchNotices({pageParam: 0, size: 3});
        if (response && response.content) {
          setNotices(response.content.slice(0, 3)); // content의 첫 3개 항목만 설정
        } else {
          console.error('Invalid response structure:', response);
        }
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#333" />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        keyExtractor={item => item.groupNoticeId.toString()}
        renderItem={({item}) => (
          <NoticeItem
            author={item.guardian.name}
            time={new Date(item.createdAt).toLocaleString()} // 간단히 날짜 변환
            text={item.content}
            photo={item.photos[0]} // 첫 번째 사진만 사용
          />
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default HomeNotices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
});
