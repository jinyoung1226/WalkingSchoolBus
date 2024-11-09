import React from 'react';
import {View, FlatList, Text, Image, ActivityIndicator} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchNotices} from '../api/noticeApi';

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
  // Infinite Query 설정
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
    staleTime: 60000,
    cacheTime: 300000,
  });

  // 로딩 상태 처리
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
    <View style={{flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16}}>
      <FlatList
        data={notices}
        keyExtractor={item => item.groupNoticeId.toString()}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 326,
              padding: 10,
              backgroundColor: '#FFFFFF',
              marginBottom: 16,
            }}>
            {/* 텍스트 영역 */}
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexGrow: 1,
                gap: 4,
                paddingRight: item.photos?.length > 0 ? 32 : 0,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'left',
                  color: '#333d4b',
                  lineHeight: 17,
                  maxWidth: 192,
                }}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item.content}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  textAlign: 'left',
                  color: '#8a8a8a',
                }}>
                {item.guardian?.name || '익명'} 인솔자・
                {formatDate(item.createdAt)}
              </Text>
            </View>
            {/* 이미지 영역 */}
            {item.photos?.length > 0 && (
              <Image
                source={{uri: item.photos[0]}}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 7,
                }}
                resizeMode="cover"
              />
            )}
          </View>
        )}
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
