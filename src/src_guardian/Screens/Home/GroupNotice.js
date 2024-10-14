import React, {useEffect} from 'react';
import {
  Button,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import NoticeItem from '../../../components/NoticeComponent';
import useNoticeStore from '../../../store/noticeStore';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../components/CustomHeader';
import Pencil from '../../../assets/icons/Pencil.svg';

const GroupNotice = ({navigation}) => {
  // Zustand에서 상태와 설정 함수 가져오기
  const {notices, setNotices, fetchNotices, error, hasNextPage} =
    useNoticeStore();

  // 로딩 및 페이징 상태 관리
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0); // 페이지 번호 상태
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false); // 다음 페이지 로딩 상태

  // 실제 데이터를 가져오는 함수
  const loadNotices = async (pageToLoad = 0) => {
    setLoading(pageToLoad === 0); // Only set loading true for initial load
    setIsFetchingNextPage(pageToLoad > 0);
    await fetchNotices(pageToLoad);
    setLoading(false);
    setIsFetchingNextPage(false);
  };

  // 처음 데이터 가져오기
  useEffect(() => {
    loadNotices();
  }, []);

  // 다음 페이지 불러오기
  const loadMoreNotices = () => {
    if (hasNextPage && !isFetchingNextPage && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotices(nextPage);
    }
  };

  if (loading && page === 0) {
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
        <Button
          title="다시 시도"
          onPress={() => {
            setPage(0);
            loadNotices(0);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="그룹 공지"
        headerRight={<Pencil />}
        onPressRightButton={() => navigation.navigate('CreateNotice')}
      />

      <FlatList
        data={notices}
        renderItem={({item}) => (item ? <NoticeItem notice={item} /> : null)}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMoreNotices}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#2ee8a5" />
          ) : null
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
      />
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
