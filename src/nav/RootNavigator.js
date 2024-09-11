import React, {useState} from 'react';
import {View, Button} from 'react-native';
import ParentRootNavigator from './ParentRootNavigator';
import GuardianRootNavigator from './GuardianRootNavigator';
import useAuthStore from '../store/authStore';

const RootNavigator = () => {
  const {userType, setUserType, isAuthenticated} = useAuthStore();
  console.log(userType, 'root');
  console.log(isAuthenticated, 'isAuthenticated');

  // userType이 null일 때 선택 화면으로 이동
  if (userType === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="학부모용" onPress={() => setUserType('PARENT')} />
        <Button title="인솔자용" onPress={() => setUserType('GUARDIAN')} />
      </View>
    );
  }

  // userType이 PARENT일 때 ParentRootNavigator, GUARDIAN일 때 GuardianRootNavigator
  if (userType === 'PARENT') {
    return <ParentRootNavigator />;
  } else if (userType === 'GUARDIAN') {
    return <GuardianRootNavigator />;
  }
};

export default RootNavigator;
