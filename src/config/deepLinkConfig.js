import { Linking } from 'react-native';


export const linking = {
  prefixes: ['donghang://'],
  config: {
    screens: {
      initialRouteName : 'ShuttleTab',
      HomeTab: 'home',
      ShuttleTab: {
        initialRouteName: 'ShuttleMain',
        screens: {
          ShuttleMain: 'shuttle',
          ShuttleDetail: 'shuttle/shuttleDetail',
        },
      },
      NotificationTab: 'notification',
      MypageTab: 'mypage',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url != null) return url;
  },
};