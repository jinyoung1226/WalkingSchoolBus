import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/nav/RootNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
