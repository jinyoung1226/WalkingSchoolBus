// ../../../components/NoticeComponent.js
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

// 화면의 너비를 가져옵니다.
const {width} = Dimensions.get('window');

// 날짜를 포맷팅하는 헬퍼 함수
const formatDate = createdAt => {
  try {
    // ISO 8601 형식으로 파싱
    const createdDate = new Date(createdAt); // parseISO 대신 Date 사용
    const now = new Date();

    // 두 날짜 사이의 일 수 차이 계산
    const daysDifference = Math.floor(
      (now - createdDate) / (1000 * 60 * 60 * 24),
    );

    if (daysDifference < 1) {
      // 1일 미만: "x분 전", "x시간 전" 등
      const minutesDifference = Math.floor((now - createdDate) / (1000 * 60));
      if (minutesDifference < 60) {
        return `${minutesDifference}분 전`;
      }
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference}시간 전`;
    } else if (daysDifference === 1) {
      // 어제
      return '어제';
    } else {
      // 그 외: "MM/dd"
      const month = createdDate.getMonth() + 1; // 월은 0부터 시작
      const day = createdDate.getDate();
      return `${month}/${day}`;
    }
  } catch (error) {
    console.error('Invalid date format:', createdAt);
    return '';
  }
};

const NoticeItem = ({notice}) => {
  // Zustand에서 toggleLike 함수 가져오기
  const toggleLike = useNoticeStore(state => state.toggleLike);

  // FlatList의 참조를 생성합니다 (필요한 경우 사용)
  const flatListRef = useRef(null);

  // createdAt을 날짜로 변환
  const formattedDate = formatDate(notice.createdAt);

  // 이미지 슬라이드 이동을 위한 함수들
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

  // 현재 슬라이드 인덱스를 추적하기 위한 상태
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleLikePress = () => {
    console.log(`Like button pressed for notice ID: ${notice.id}`);
    toggleLike(notice.id);
  };

  return (
    <View style={styles.noticeContainer}>
      {/* 작성자 정보 */}
      <View style={styles.authorContainer}>
        {/* 작성자의 프로필 이미지 표시 */}
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

      {/* 공지 이미지 캐러셀 */}
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
          {/* 좌우 버튼 */}
          {notice.photos.length > 1 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={scrollToPrev}
                disabled={currentIndex === 0}
                accessibilityLabel="이전 이미지">
                <Text
                  style={[
                    styles.navButtonText,
                    currentIndex === 0 && styles.disabledButtonText,
                  ]}>
                  ‹
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={scrollToNext}
                disabled={currentIndex === notice.photos.length - 1}
                accessibilityLabel="다음 이미지">
                <Text
                  style={[
                    styles.navButtonText,
                    currentIndex === notice.photos.length - 1 &&
                      styles.disabledButtonText,
                  ]}>
                  ›
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/* 페이지 인디케이터 */}
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

      {/* 공지 내용 */}
      <Text style={styles.content}>{notice.content}</Text>

      {/* 좋아요 및 댓글 */}
      <View style={styles.noticeFooter}>
        <TouchableOpacity
          style={styles.iconTextContainer}
          onPress={handleLikePress}
          disabled={notice.isLiking} // 좋아요 처리 중이면 버튼 비활성화
          accessibilityLabel={notice.isLiked ? '좋아요 취소' : '좋아요 추가'}
          accessibilityHint="공지사항에 좋아요를 표시하거나 취소합니다.">
          <View style={styles.iconContainer}>
            {/* isLiked에 따라 하트 또는 언하트 SVG 적용 */}
            {notice.isLiked ? (
              <Heart width={20} height={20} style={styles.likeIcon} />
            ) : (
              <UnHeart width={20} height={20} style={styles.likeIcon} />
            )}
          </View>
          <Text style={styles.likeText}>좋아요 {notice.likes}개</Text>
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

      {/* 구분선 */}
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  noticeContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,

    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android 그림자
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
    marginHorizontal: 4,
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
    marginRight: 4, // 아이콘과 텍스트 사이에 여백 추가
  },
  likeIcon: {
    marginRight: 4,
  },
  likeText: {
    fontSize: 12,
    color: '#ff6972',
  },
  separator: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
  },
});

export default NoticeItem;
