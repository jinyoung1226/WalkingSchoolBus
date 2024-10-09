import React from 'react';
import {View} from 'react-native';
import WaypointIndicatorIcon from '../assets/icons/WaypointIndicatorIcon.svg';

const WaypointIndicator = ({isLastItem}) => {
  return <View>{!isLastItem && <WaypointIndicatorIcon />}</View>;
};

export default WaypointIndicator;
