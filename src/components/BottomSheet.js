import React, { useRef, useEffect } from 'react';
import {
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import MyLocationIcon from '../assets/icons/MyLocationIcon.svg';

const BottomSheet = ({ handleCenterOnGuide }) => {
  const screenHeight = Dimensions.get('screen').height;

  // 단계별 높이
  const peekHeight = 100; // 기본 노출 높이
  const fullHeight = screenHeight * 0.7; // 최대 높이 (70% 화면 높이)

  const panY = useRef(new Animated.Value(screenHeight - peekHeight)).current;

  const translateY = panY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: [0, screenHeight],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newY = panY._value + gestureState.dy;
        if (newY >= screenHeight - fullHeight && newY <= screenHeight - peekHeight) {
          panY.setValue(newY);
        }
      },
      onPanResponderRelease: () => {
        // 드래그가 끝난 후 바텀시트는 그 위치에 고정됨
      },
    })
  ).current;

  return (
    <View style={{ position: 'absolute', width: '100%' }}>
      <Animated.View
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: [{ translateY: translateY }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 32, right: 32 }}
          onPress={handleCenterOnGuide}
        >
          <MyLocationIcon />
        </TouchableOpacity>
        <View
          style={{
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 50,
              height: 5,
              backgroundColor: '#ccc',
              borderRadius: 5,
            }}
          />
        </View>
        <View style={{ padding: 16 }}>
          <Text>바텀시트 내용</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default BottomSheet;
