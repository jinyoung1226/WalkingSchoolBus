import React, {useEffect} from 'react';
import {View, FlatList, Text, Image, ActivityIndicator} from 'react-native';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {fetchNotices} from '../api/noticeApi';
import { colors, textStyles } from '../styles/globalStyle';

// 날짜 포맷 함수
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
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['Notices'],
    queryFn: ({pageParam = 0}) => fetchNotices({pageParam, size: 3}),
    getNextPageParam: lastPage => {
      return lastPage.content.length < 10 ? undefined : lastPage.number + 1;
    },
    staleTime: 0,
    cacheTime: 0,
  });

  useEffect(() => {
    queryClient.invalidateQueries(['Notices']);
  }, [queryClient]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2ee8a5" />
      </View>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}>
        <Text style={{fontSize: 14, color: '#ff0000'}}>
          공지사항을 불러오는 데 실패했습니다.
        </Text>
      </View>
    );
  }

  // 데이터 병합 후 슬라이싱
  const allNotices = data?.pages.flatMap(page => page.content) || [];
  const notices = allNotices.slice(0, 3); // 병합된 데이터 중 첫 3개만 표시

  // FlatList 컴포넌트 렌더링
  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <FlatList
        data={notices}
        keyExtractor={item => item.groupNoticeId.toString()}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              flex:1,
              backgroundColor: '#FFFFFF',
              padding: 16
            }}>
            <View style={{flex:1, height: 70, justifyContent:'space-between', paddingVertical:5}}>
              <Text
                numberOfLines={2}
                style={[textStyles.M4, {color: colors.Black}]}>
                {item.content}
              </Text>

              <Text
                style={[textStyles.R3, {color:colors.Gray06}]}>
                {item.guardian?.name || '익명'} {"인솔자 ・ "}
                {formatDate(item.createdAt)}
              </Text>
            </View>
            <View style={{width:32}} />
            {item.photos?.length > 0 && (
              <View style={{width: 70, height: 70, borderRadius:10, overflow:'hidden'}}>
                <Image
                  source={{uri: item.photos[0]}}
                  style={{
                    flex:1
                  }}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        )}
        scrollEnabled={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage && (
            <ActivityIndicator size="small" color="#2ee8a5" />
          )
        }
        contentContainerStyle={{}}
      />
    </View>
  );
};

export default HomeNotices;
