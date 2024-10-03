import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
// import colors from '../styles/colors';
// import {textStyles} from '../styles/textStyles';
import useTabBarStore from '../store/tabBarStore';
import { colors, textStyles } from '../styles/globalStyle';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  
  // Zustand 스토어에서 isTabBarVisible 상태 가져오기
  const isTabBarVisible = useTabBarStore(state => state.isTabBarVisible);

  if (!isTabBarVisible) {
    return null;
  }

  return (
    <View
      style={{
        // backgroundColor: colors.white,
        height: Platform.OS === 'ios' ? 93 : 72,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 20,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
            style={{
              borderRadius: 100,
              padding:4,
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused: isFocused,
                size: 24,
              })}
            <View style={{height: 3}} />
            <Text
              style={[
                textStyles.M5,
                        { color: isFocused ? colors.Main_Green : colors.Gray06 }]}
            >
              {label}
            </Text>
            </View>
            <View style={{height: Platform.OS === 'ios' ? 21 : 0}} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
