import { useEffect } from 'react';
import {Button, Text, View} from 'react-native';
import useParentGroupInfo from '../../hooks/queries/useParentGroupInfo';
import useWaypoints from '../../../src_guardian/hooks/queries/useWaypoints';
const ShuttleMain = ({navigation}) => {

  const { data: groupInfo, isPending: groupInfoIsPending, isSuccess: groupInfoIsSuccess } = useParentGroupInfo();
  const { data: waypoints, isPending: waypointsIsPending, isSuccess: waypointsIsSuccess } = useWaypoints();
  useEffect(() => {
    if (groupInfo) {
      navigation.navigate('ShuttleDetail', {groupInfo, waypoints});
    }
    
  }, [groupInfo]);

  return (
    <View>
      <Text>Shuttle Main</Text>
      <Button title="운행 화면으로 돌아가기"
        onPress={() => {
          navigation.navigate('ShuttleDetail', {groupInfo, waypoints});
        }}
      />
    </View>
  );
};

export default ShuttleMain;
