import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
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

const NoticeItem = ({item}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();
  const {mutate: toggleLike} = useNoticeLike();
  const [imageHeights, setImageHeights] = useState({});
  const [isLiked, setIsLiked] = useState(item.liked);
  const [likesCount, setLikesCount] = useState(item.likes);

  const handleImageLoad = (index, event) => {
    const {width: imageWidth, height: imageOriginalHeight} =
      event.nativeEvent.source;
    const calculatedHeight = (imageOriginalHeight * (width - 32)) / imageWidth;
    setImageHeights(prev => ({...prev, [index]: calculatedHeight}));
  };

  const handleLikePress = () => {
    setIsLiked(prevIsLiked => !prevIsLiked);
    setLikesCount(prevLikesCount =>
      isLiked ? prevLikesCount - 1 : prevLikesCount + 1,
    );
    toggleLike(item.groupNoticeId);
  };

  useEffect(() => {
    queryClient.invalidateQueries(['notices']);
  }, [isLiked, queryClient]);

  return (
    <View>
      <View style={{marginBottom: 16, paddingHorizontal: 16}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          {item.guardian?.imagePath ? (
            <Image
              source={{uri: item.guardian.imagePath}}
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
              {item.guardian?.name} 인솔자님
            </Text>
            <Text style={{fontSize: 12, color: '#8a8a8a'}}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>

        {item.photos?.length > 0 && (
          <View style={{position: 'relative'}}>
            <FlatList
              data={item.photos || []} // photos가 undefined면 빈 배열로 설정
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(photo, index) => `${index}`}
              renderItem={({item: photo, index}) => (
                <View style={{position: 'relative'}}>
                  <Image
                    source={{uri: photo}}
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
                  {/* 페이지 인디케이터 */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 0,
                      right: 0,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    {item.photos.map((_, indicatorIndex) => (
                      <View
                        key={indicatorIndex}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          marginHorizontal: 4,
                          backgroundColor:
                            currentIndex === indicatorIndex
                              ? '#2ee8a5'
                              : '#ccc',
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
              onScroll={event => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width,
                );
                setCurrentIndex(index);
              }}
              scrollEventThrottle={16}
            />
          </View>
        )}
        <Text
          style={{
            fontSize: 14,
            color: '#000',
            marginVertical: 16,
            paddingHorizontal: 8,
          }}>
          {item.content}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            marginBottom: 8,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 16,
            }}
            onPress={handleLikePress}>
            <View style={{marginRight: 4}}>
              {isLiked ? (
                <Heart width={20} height={20} style={{marginRight: 4}} />
              ) : (
                <UnHeart width={20} height={20} style={{marginRight: 4}} />
              )}
            </View>
            <Text
              style={{
                fontSize: 12,
                color: isLiked ? '#ff6972' : '#000',
              }}>
              좋아요 {likesCount}개
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NoticeItem;
