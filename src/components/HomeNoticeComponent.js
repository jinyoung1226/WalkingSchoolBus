import React from 'react';
import {View, FlatList, Text, Image} from 'react-native';
import {useQuery} from '@tanstack/react-query';
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

// HomeNotices 컴포넌트
const HomeNotices = () => {
  // React Query를 사용하여 데이터를 가져옵니다.
  const {data, isLoading, isError} = useQuery({
    queryKey: ['homeNotices'],
    queryFn: () => fetchNotices({pageParam: 0, size: 3}), // 최대 3개 데이터 가져오기
    staleTime: 0, // 항상 최신 데이터를 가져오도록 설정
    cacheTime: 1000 * 60 * 5, // 캐시 시간 5분
  });

  // 로딩 상태 처리
  if (isLoading) {
    return null; // 로딩 중에는 아무것도 표시하지 않음
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

  // 데이터가 없는 경우 기본값 설정
  const notices = data?.content || []; // content 필드가 없으면 빈 배열 반환

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16}}>
      <FlatList
        data={notices}
        keyExtractor={item => item.groupNoticeId.toString()} // 각 항목의 고유 ID
        renderItem={({item, index}) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 326,
              padding: 10,
              backgroundColor: '#FFFFFF',
              marginBottom: index === notices.length - 1 ? 0 : 16, // 마지막 항목 여백 제거
            }}>
            {/* 텍스트 영역 */}
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexGrow: 1,
                gap: 4,
                paddingRight: item.photos?.length > 0 ? 32 : 0, // 이미지가 있을 경우 여백 추가
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'left',
                  color: '#333d4b',
                  lineHeight: 17,
                  maxWidth: 192, // 텍스트가 이미지 영역을 침범하지 않도록 제한
                }}
                numberOfLines={2} // 최대 2줄
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
                source={{uri: item.photos[0]}} // 첫 번째 이미지만 표시
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 7, // 모서리 둥글기
                }}
                resizeMode="cover"
              />
            )}
          </View>
        )}
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      />
    </View>
  );
};

export default HomeNotices;
