import React from 'react';
import Login from '../Screens/Auth/Login';
import Register from '../Screens/Auth/Register';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} options={{ title: '회원가입', headerTitleAlign: 'center'}}/>
  </Stack.Navigator>
);

export default AuthNavigator;
