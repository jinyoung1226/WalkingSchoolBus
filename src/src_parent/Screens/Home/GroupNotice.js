import React, {useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import NoticeItem from '../../../components/NoticeItem';
import CustomHeader from '../../../components/CustomHeader';
import EmptyNotice from '../../../assets/icons/EmptyNotice.svg';
import useInfiniteNotices from '../../../src_guardian/hooks/queries/useInfiniteNotices';
import {useQueryClient} from '@tanstack/react-query';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const GroupNotice = () => {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteNotices();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      queryClient.removeQueries(['notices']);
    };
  }, [queryClient]);

  const loadMoreNotices = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2ee8a5" />
      </View>
    );
  }

  if (error) {
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
          공지사항을 불러오는 중 오류 발생했습니다.
        </Text>
      </View>
    );
  }

  const isEmpty = data?.pages.every(page => page.content.length === 0) || false;
  const notices = data?.pages.flatMap(page => page.content) || [];
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 16,
        backgroundColor: '#feffff',
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}>
      <CustomHeader title="그룹 공지" />
      {isEmpty ? (
        <View style={{marginTop: 260, alignItems: 'center'}}>
          <EmptyNotice width={169} height={95} />
        </View>
      ) : (
        <FlatList
          style={{flex: 1}}
          data={notices}
          renderItem={({item}) => item && <NoticeItem item={item} />}
          keyExtractor={(item, index) =>
            item?.groupNoticeId
              ? item.groupNoticeId.toString()
              : index.toString()
          }
          onEndReached={loadMoreNotices}
          onEndReachedThreshold={0.8}
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
