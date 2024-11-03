import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import UnHeart from '../assets/icons/UnHeart.svg';
import Heart from '../assets/icons/Heart.svg';
import useNoticeLike from '../src_guardian/hooks/mutations/useNoticeLike';

const {width} = Dimensions.get('window');

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

const NoticeItem = ({notice}) => {
  const {mutate: toggleLike, isLoading: isLiking} = useNoticeLike();
  const flatListRef = useRef(null);
  const [imageHeights, setImageHeights] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageLoad = (index, event) => {
    const {width: imageWidth, height: imageOriginalHeight} =
      event.nativeEvent.source;
    const calculatedHeight = (imageOriginalHeight * (width - 32)) / imageWidth;
    setImageHeights(prev => ({...prev, [index]: calculatedHeight}));
  };

  const handleLikePress = () => {
    console.log(`Toggling like for notice ID: ${notice.groupNoticeId}`);
    toggleLike({id: notice.groupNoticeId, isCurrentlyLiked: notice.isLiked});
  };

  return (
    <View style={{marginBottom: 16, paddingHorizontal: 16}}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
        {notice.authorImage ? (
          <Image
            source={{uri: notice.authorImage}}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 8,
            }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#d9d9d9',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}>
            <Text style={{fontSize: 10, color: '#fff', textAlign: 'center'}}>
              프로필사진
            </Text>
          </View>
        )}
        <View style={{flexDirection: 'column'}}>
          <Text style={{fontSize: 14, fontWeight: '600', color: '#000'}}>
            {notice.authorName || '작성자'} 인솔자님
          </Text>
          <Text style={{fontSize: 12, color: '#8a8a8a'}}>
            {formatDate(notice.createdAt)}
          </Text>
        </View>
      </View>

      {notice.photos && notice.photos.length > 0 && (
        <View style={{position: 'relative'}}>
          <FlatList
            data={notice.photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item, index}) => (
              <Image
                source={{uri: item}}
                style={{
                  width: width - 32,
                  height: imageHeights[index] || 200,
                  borderRadius: 10,
                  backgroundColor: '#e9e9e9',
                  marginTop: 16,
                }}
                resizeMode="cover"
                onLoad={event => handleImageLoad(index, event)}
              />
            )}
            ref={flatListRef}
            onScroll={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setCurrentIndex(index);
            }}
            scrollEventThrottle={16}
          />

          {notice.photos.length > 1 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
              }}>
              {notice.photos.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor:
                      currentIndex === index ? '#2ee8a5' : '#ccc',
                  }}
                />
              ))}
            </View>
          )}
        </View>
      )}

      <Text
        style={{
          fontSize: 14,
          color: '#000',
          marginVertical: 16,
          paddingHorizontal: 8,
        }}>
        {notice.content}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          marginBottom: 8,
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 16}}
          onPress={handleLikePress}
          disabled={isLiking}
          accessibilityLabel={notice.isLiked ? '좋아요 취소' : '좋아요 추가'}
          accessibilityHint="공지사항에 좋아요를 표시하거나 취소합니다.">
          <View style={{marginRight: 4}}>
            {notice.isLiked ? (
              <Heart width={20} height={20} style={{marginRight: 4}} />
            ) : (
              <UnHeart width={20} height={20} style={{marginRight: 4}} />
            )}
          </View>
          <Text
            style={{fontSize: 12, color: notice.isLiked ? '#ff6972' : '#000'}}>
            좋아요 {notice.likes}개
          </Text>
          {isLiking && (
            <ActivityIndicator
              size="small"
              color="#2ee8a5"
              style={{marginLeft: 8}}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoticeItem;
