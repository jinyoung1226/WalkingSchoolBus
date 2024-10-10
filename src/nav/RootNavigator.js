import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Button, Alert, ActivityIndicator} from 'react-native';
import ParentRootNavigator from './ParentRootNavigator';
import GuardianRootNavigator from './GuardianRootNavigator';
import useAuthStore from '../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '../api/api';
import SplashScreen from '../components/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { linking } from '../config/deepLinkConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const RootNavigator = () => {
  const {
    userType,
    isAutoLoginLoading,
    isUserTypeLoading,
    setUserType,
    setAutoLogin,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSetUserType = async (userType) => {
    await AsyncStorage.setItem('userType', userType);
    setUserType(userType);
  };
  const queryClient = new QueryClient();
  // 자동로그인 API 호출
  const checkAuth = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (accessToken) {
      try {
        const response = await authApi.post('token/signIn');
        if (response.status == 200) {
          console.log(response.data, 'token/signIn');
          const userId = response.data.id;
          const userType = response.data.userType;
          setAutoLogin(true, false, accessToken, userType, userId);
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          Alert.alert('로그인이 필요합니다');
          setAutoLogin(false, false, null, null, null);
        } else {
          console.log(error);
          setAutoLogin(false, false, null, null, null);
        }
      }
    } else {
      setAutoLogin(false, false, null, null, null);
    }
  };

  // 자동로그인 시, 보여줄 화면
  if (isUserTypeLoading || isAutoLoginLoading) {
    return (
      <SplashScreen />
    );
  }

  // userType이 null일 때 선택 화면으로 이동
  if (userType === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="학부모용" onPress={() => handleSetUserType('PARENT')} />
        <Button title="인솔자용" onPress={() => handleSetUserType('GUARDIAN')} />
      </View>
    );
  }

  if (userType) {
    return (
      <QueryClientProvider client={queryClient}>
        <NavigationContainer linking={linking}>
          {userType === 'PARENT' ? <ParentRootNavigator /> : <GuardianRootNavigator />}
        </NavigationContainer>
      </QueryClientProvider>
    );
  }
};

export default RootNavigator;
