import React from 'react';
import {View, Text, Image} from 'react-native';
import {colors, textStyles} from '../styles/globalStyle';

const MessageItem = ({ name, imagePath, receivedAt, content }) => {

  return (
    <View style={{paddingHorizontal: 16}}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.Gray01,
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderRadius: 14,
          gap: 16,
        }}
      >
        <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
          <View
            style={{
              width:44,
              height:44,
              borderRadius: 22,
              backgroundColor: colors.Gray03,
              overflow: 'hidden',
            }}>
            <Image
              src={imagePath}
              style={{flex:1}}
            />
          </View>
          <View>
            <Text style={[textStyles.SB4, {color: colors.Black}]}>
              {name}
            </Text>
            <Text style={[textStyles.M5, {color: colors.Gray05}]}>
              {receivedAt}
            </Text>
          </View>
        </View>
        <Text style={[textStyles.M4, {color: colors.Black}]}>
          {content}
        </Text>
      </View>
    </View>
  );
};

export default MessageItem;
