import React, {useEffect, useCallback} from 'react';
import {
  Button,
  View,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import NoticeItem from '../../../components/NoticeItem';
import useNoticeStore from '../../../store/noticeStore';
import CustomHeader from '../../../components/CustomHeader';
import Pencil from '../../../assets/icons/Pencil.svg';
import EmptyNotice from '../../../assets/icons/EmptyNotice.svg';
import {useFocusEffect} from '@react-navigation/native';

const GroupNotice = ({navigation}) => {
  const {notices, fetchNotices, error, hasNextPage} = useNoticeStore();
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);

  const loadNotices = async (pageToLoad = 0) => {
    setLoading(pageToLoad === 0);
    setIsFetchingNextPage(pageToLoad > 0);
    await fetchNotices(pageToLoad);
    setLoading(false);
    setIsFetchingNextPage(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotices(0);
    }, []),
  );

  useEffect(() => {
    loadNotices();
  }, []);

  const loadMoreNotices = () => {
    if (hasNextPage && !isFetchingNextPage && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotices(nextPage);
    }
  };

  if (loading && page === 0) {
    // 초기 로딩 화면
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2ee8a5" />
      </View>
    );
  }

  if (error && error !== 403) {
    // 403 이외의 에러가 발생했을 때 에러 메시지와 다시 시도 버튼 표시
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}>
        <Text
          style={{
            fontSize: 16,
            color: '#ff0000',
            marginBottom: 16,
            textAlign: 'center',
          }}>
          공지사항을 불러오는 중 오류가 발생했습니다.
        </Text>
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
    <View style={{flex: 1, paddingTop: 16, backgroundColor: '#feffff'}}>
      <CustomHeader
        title="그룹 공지"
        headerRight={
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateNotice')}
            style={{paddingHorizontal: 10}}>
            <Pencil width={56} height={17} />
          </TouchableOpacity>
        }
      />
      {error === 403 ? (
        <View style={{marginTop: 260, alignItems: 'center'}}>
  <EmptyNotice width={169} height={95} />
</View>
      ) : (
        // 공지 리스트 표시
        <FlatList
          data={notices}
          renderItem={({item}) => item && <NoticeItem notice={item} />}
          keyExtractor={item => item.id.toString()}
          onEndReached={loadMoreNotices}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isFetchingNextPage && (
              <ActivityIndicator size="small" color="#2ee8a5" />
            )
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
          ItemSeparatorComponent={() => (
            <View
              style={{height: 5, backgroundColor: '#e9e9e9', marginBottom: 16}}
            />
          )}
        />
      )}
    </View>
  );
};

export default GroupNotice;
