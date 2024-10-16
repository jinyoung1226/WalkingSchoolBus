import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import UnHeart from '../assets/icons/UnHeart.svg';
import Heart from '../assets/icons/Heart.svg';
import useNoticeStore from '../store/noticeStore';

const {width} = Dimensions.get('window');

const formatDate = createdAt => {
  try {
    // ISO 8601 형식으로 파싱
    const createdDate = new Date(createdAt); // parseISO 대신 Date 사용
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
  // Zustand에서 함수 가져오기
  const toggleLike = useNoticeStore(state => state.toggleLike);
  const flatListRef = useRef(null);

  const formattedDate = formatDate(notice.createdAt);
  const scrollToNext = () => {
    if (currentIndex < notice.photos.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
    }
  };

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({index: currentIndex - 1});
    }
  };

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleLikePress = () => {
    console.log(`Like button pressed for notice ID: ${notice.id}`);
    toggleLike(notice.id);
  };

  return (
    <View style={styles.noticeContainer}>
      <View style={styles.authorContainer}>
        {notice.authorImage ? (
          <Image
            source={{uri: notice.authorImage}}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>프로필사진</Text>
          </View>
        )}
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{notice.authorName || '작성자'}</Text>
          <Text style={styles.createdAt}>{formattedDate}</Text>
        </View>
      </View>

      {notice.photos && notice.photos.length > 0 && (
        <View style={styles.carouselContainer}>
          <FlatList
            data={notice.photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item}) => (
              <Image
                source={{uri: item}}
                style={styles.noticeImage}
                resizeMode="cover"
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
            <View style={styles.buttonContainer}></View>
          )}
          <View style={styles.indicatorContainer}>
            {notice.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentIndex === index
                    ? styles.activeIndicator
                    : styles.inactiveIndicator,
                ]}
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.content}>{notice.content}</Text>

      <View style={styles.noticeFooter}>
        <TouchableOpacity
          style={styles.iconTextContainer}
          onPress={handleLikePress}
          disabled={notice.isLiking}
          accessibilityLabel={notice.isLiked ? '좋아요 취소' : '좋아요 추가'}
          accessibilityHint="공지사항에 좋아요를 표시하거나 취소합니다.">
          <View style={styles.iconContainer}>
            {notice.isLiked ? (
              <Heart width={20} height={20} style={styles.likeIcon} />
            ) : (
              <UnHeart width={20} height={20} style={styles.likeIcon} />
            )}
          </View>
          {notice.isLiked ? (
            <Text style={styles.addLikeText}>좋아요 {notice.likes}개</Text>
          ) : (
            <Text style={styles.likeText}>좋아요 {notice.likes}개</Text>
          )}
          {/* 좋아요 처리 중이면 로딩 인디케이터 표시 */}
          {notice.isLiking && (
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

const styles = StyleSheet.create({
  noticeContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  profilePlaceholderText: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
  },
  authorInfo: {
    flexDirection: 'column',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  createdAt: {
    fontSize: 12,
    color: '#8a8a8a',
  },
  carouselContainer: {
    position: 'relative',
  },
  noticeImage: {
    width: width - 32, // 화면 너비에 맞게 조정 (padding 16 * 2)
    height: 200,
    borderRadius: 10,
    backgroundColor: '#e9e9e9', // 이미지 로딩 전 배경색
  },
  buttonContainer: {
    position: 'absolute',
    top: '45%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
  },
  disabledButtonText: {
    color: '#ccc',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: '#2ee8a5',
  },
  inactiveIndicator: {
    backgroundColor: '#ccc',
  },
  content: {
    fontSize: 14,
    color: '#000',
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  noticeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    marginRight: 4,
  },
  likeIcon: {
    marginRight: 4,
  },
  likeText: {
    fontSize: 12,
    color: '#000',
  },
  addLikeText: {
    fontSize: 12,
    color: '#ff6972',
  },
});

export default NoticeItem;
