import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/nav/RootNavigator';
import * as encoding from 'text-encoding';

const App = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
