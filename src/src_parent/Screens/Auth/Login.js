import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {api} from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import useAuthStore from '../../../store/authStore';
import CustomButton from '../../../components/CustomButton';
import LoginParentText from '../../../assets/icons/LoginParentText';
import { textStyle, colors } from '../../../styles/globalStyle';

const Login = ({navigation}) => {
  // email, password 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Zustand setLogin, setUserType 액션 가져오기
  const {setLogin, setUserType, userType} = useAuthStore();

  // 로그인 API 호출
  const login = async () => {
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log(fcmToken);
      const response = await api.post('/auth/signIn', {email, password, fcmToken});
      console.log(response.data, "로그인");
      if (response.status === 200) {
        const {accessToken, refreshToken, id: userId} = response.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        await EncryptedStorage.setItem('refreshToken', refreshToken);
        setLogin(true, accessToken, 'PARENT', userId);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        Alert.alert('로그인이 필요합니다');
        setLogin(false, null, userType, null);
      } else {
        Alert.alert('서버 접속 오류');
        setLogin(false, null, userType, null);
      }
    }
  };

  // 회원가입 화면으로 이동
  const handleRegister = () => {
    navigation.navigate('Register');
  };
  // 인솔자 로그인 화면으로 전환
  const navigateToGuardianLogin = async() => {
    setUserType('GUARDIAN');
    await AsyncStorage.setItem('userType', 'GUARDIAN');
  };

  return (
    <View style={{flex: 1, padding: 16, paddingTop: 128, backgroundColor: colors.White}}>
      <LoginParentText style={{marginLeft: 16}}/>
      <View style={{height: 64}}/>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: colors.Gray03,
          padding: 16,
          marginBottom: 16,
          borderRadius: 10,
          color: colors.Gray07
        }}
        value={email}
        onChangeText={setEmail}
        placeholder="아이디를 입력해주세요"
        placeholderTextColor={colors.Gray05}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: colors.Gray03,
          padding: 16,
          borderRadius: 10,
          color: colors.Gray07
        }}
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호를 입력해주세요"
        placeholderTextColor={colors.Gray05}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <View style={{height: 32}}/>
      <CustomButton title="로그인" onPress={login} />
      <TouchableOpacity onPress={handleRegister}>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToGuardianLogin}>
      <View style={{height: 24}}/>
        <Text style={{marginTop: 16, color: colors.Main_Green, textAlign: 'center'}}>
          인솔자 버전으로 전환하기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
