import React, { useRef, useEffect } from 'react';
import {Text, Dimensions, Animated, PanResponder } from 'react-native';
import { View } from 'react-native';


const BottomSheet = () => {
  const screenHeight = Dimensions.get('screen').height;
  const fullHeight = 300; // 2단계 높이
  const midHeight = 200; // 1단계 높이
  const peekHeight = 100; // 기본 노출 높이

  const panY = useRef(new Animated.Value(screenHeight - peekHeight)).current;

  const translateY = panY.interpolate({
    inputRange: [screenHeight - fullHeight, screenHeight - midHeight, screenHeight - peekHeight],
    outputRange: [screenHeight - fullHeight, screenHeight - midHeight, screenHeight - peekHeight],
    extrapolate: 'clamp',
  });

  const snapToHeight = (targetHeight) =>
    Animated.timing(panY, {
      toValue: screenHeight - targetHeight,
      duration: 300,
      useNativeDriver: true,
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
      onPanResponderRelease: (event, gestureState) => {
        const currentY = panY._value;

        if (gestureState.vy > 0.5 || gestureState.dy > 100) {
          // 아래로 드래그
          if (currentY <= screenHeight - midHeight) {
            snapToHeight(midHeight).start();
          } else {
            snapToHeight(peekHeight).start();
          }
        } else if (gestureState.vy < -0.5 || gestureState.dy < -100) {
          // 위로 드래그
          if (currentY >= screenHeight - midHeight) {
            snapToHeight(midHeight).start();
          } else {
            snapToHeight(fullHeight).start();
          }
        } else {
          // 드래그 속도가 느릴 때 위치에 따라 스냅
          const midPoint = (screenHeight - fullHeight + screenHeight - midHeight) / 2;
          const lowPoint = (screenHeight - midHeight + screenHeight - peekHeight) / 2;

          if (currentY < midPoint) {
            snapToHeight(fullHeight).start();
          } else if (currentY < lowPoint) {
            snapToHeight(midHeight).start();
          } else {
            snapToHeight(peekHeight).start();
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    snapToHeight(peekHeight).start();
  }, []);

  return (
    <View  style={{position: 'absolute', width: '100%',}}>
    <Animated.View
      style={{
        width: '100%',
        height: fullHeight,
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
      <View style={{ flex: 1, padding: 16 }}>
        {panY.__getValue() <= screenHeight - fullHeight + 10 ? (
          <Text>2단계: 추가적인 내용</Text>
        ) : panY.__getValue() <= screenHeight - midHeight + 10 ? (
          <Text>1단계: 기본 정보</Text>
        ) : (
          <Text>기본 상태</Text>
        )}
      </View>
    </Animated.View>
    </View>
  );
}

export default BottomSheet;
