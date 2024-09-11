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

const Login = ({navigation}) => {
  // email, password 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Zustand setLogin, setUserType 액션 가져오기
  const {setLogin, setUserType} = useAuthStore();

  // 로그인 API 호출
  const login = async () => {
    try {
      const response = await api.post('/auth/signIn', {email, password});
      console.log(response.status);
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
        setLogin(false, null, null, null);
      } else {
        Alert.alert('서버 접속 오류');
        setLogin(false, null, null, null);
      }
    }
  };

  // 회원가입 화면으로 이동
  const handleRegister = () => {
    navigation.navigate('Register');
  };
  // 인솔자 로그인 화면으로 전환
  const navigateToGuardianLogin = () => {
    setUserType('GUARDIAN');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 16}}>
      <Text style={{fontSize: 16, marginBottom: 8}}>이메일</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          marginBottom: 16,
          borderRadius: 4,
        }}
        value={email}
        onChangeText={setEmail}
        placeholder="이메일을 입력하세요"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={{fontSize: 16, marginBottom: 8}}>비밀번호</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          marginBottom: 16,
          borderRadius: 4,
        }}
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry={true}
      />
      <Button title="로그인" onPress={login} />
      <TouchableOpacity onPress={handleRegister}>
        <Text style={{marginTop: 16, color: 'blue', textAlign: 'center'}}>
          회원가입하기
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToGuardianLogin}>
        <Text style={{marginTop: 16, color: 'blue', textAlign: 'center'}}>
          인솔자 로그인 전환
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
