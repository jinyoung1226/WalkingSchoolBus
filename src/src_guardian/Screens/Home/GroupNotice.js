import React, {useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import NoticeItem from '../../../components/NoticeItem';
import CustomHeader from '../../../components/CustomHeader';
import Pencil from '../../../assets/icons/Pencil.svg';
import EmptyNotice from '../../../assets/icons/EmptyNotice.svg';
import useInfiniteNotices from '../../hooks/queries/useInfiniteNotices';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const GroupNotice = ({navigation}) => {
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
  console.log(data);

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
  console.log(data?.pages.flatMap(page => page.content));
  return (
    <View style={{flex: 1, paddingTop: 16, backgroundColor: '#feffff', paddingBottom: insets.bottom, paddingTop: insets.top}}>
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
      {isEmpty ? ( // 모든 page.content가 비어 있을 경우
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
          onEndReachedThreshold={0.5}
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
