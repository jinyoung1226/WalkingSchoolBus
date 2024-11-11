import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Button, Alert, ActivityIndicator, Text} from 'react-native';
import ParentRootNavigator from './ParentRootNavigator';
import GuardianRootNavigator from './GuardianRootNavigator';
import useAuthStore from '../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '../api/api';
import SplashScreen from '../components/SplashScreen';
import {NavigationContainer} from '@react-navigation/native';
import {linking} from '../config/deepLinkConfig';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import MainLogo from '../../src/assets/icons/MainLogo';
import {textStyles} from '../styles/globalStyle';
import NavButton from '../components/NavButton';
import NavGuardianIcon from '../../src/assets/icons/NavGuardianIcon';
import NavParentIcon from '../../src/assets/icons/NavParentIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const handleSetUserType = async userType => {
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
    return <SplashScreen />;
  }

  // userType이 null일 때 선택 화면으로 이동
  if (userType === null) {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', paddingTop: 32}}>
        <View style={{paddingLeft: 32}}>
          <MainLogo width={39} height={69} />
          <View style={{height: 24}} />
          <Text style={[textStyles.B1, {fontSize: 28}]}>
            {'어떤 버전으로\n로그인 하시겠어요?'}
          </Text>
          <View style={{height: 16}} />
          <Text style={[textStyles.M1]}>{'사용할 버전을 선택해주세요'}</Text>
        </View>
        <View style={{height: 80}}/>
        <View
          style={{

            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 24,
          }}>
          <NavButton
            title="인솔자"
            image={<NavGuardianIcon />}
            onPress={() => handleSetUserType('GUARDIAN')}
          />
          <NavButton
            title="학부모"
            image={<NavParentIcon />}
            onPress={() => handleSetUserType('PARENT')}
          />
        </View>
        <View style={{flex: 1}}/>
      </View>
    );
  }

  if (userType) {
    return (
      <QueryClientProvider client={queryClient}>
        <NavigationContainer linking={linking}>
          {userType === 'PARENT' ? (
            <ParentRootNavigator />
          ) : (
            <GuardianRootNavigator />
          )}
        </NavigationContainer>
      </QueryClientProvider>
    );
  }
};

export default RootNavigator;
