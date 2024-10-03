import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/nav/RootNavigator';
import * as encoding from 'text-encoding';
import BootSplash from "react-native-bootsplash";

const App = () => {

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
