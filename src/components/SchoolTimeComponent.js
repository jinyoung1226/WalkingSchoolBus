import React from "react";
import { Text, View } from "react-native";
import SunIcon from "../assets/icons/SunIcon.svg";
import BallIcon from "../assets/icons/BallIcon.svg";
import { colors, textStyles } from "../styles/globalStyle";

const SchoolTimeComponent = ({ type, isSelected, title}) => {
  return (
    <View style={{ 
      paddingHorizontal:9, 
      paddingVertical:6, 
      flexDirection:'row', 
      alignItems:'center', 
      backgroundColor: isSelected ? (type === 'before' ? 'rgba(255, 128, 0, 0.1)' : 'rgba(0, 153, 255, 0.06)') : colors.Gray01, 
      borderWidth:1, borderRadius: 30, 
      borderColor: isSelected ? (type === 'before' ? colors.Orange : colors.Blue) : colors.Gray01 }}>
      {type === 'before' && <SunIcon color={isSelected ? colors.Orange : colors.Gray05}/>}
      {type === 'after' && <BallIcon color={isSelected ? colors.Blue : colors.Gray05}/>}
      <View style={{width:4}}/>
      <Text style={[, textStyles.SB5, {color: isSelected ? ( type === 'before' ? colors.Orange : colors.Blue ) : colors.Gray05}]}>
        {title}
      </Text>
    </View>
  );
}

export default SchoolTimeComponent;