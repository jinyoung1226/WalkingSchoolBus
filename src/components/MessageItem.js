import React from 'react';
import {View, Text, Image} from 'react-native';
import {colors, textStyles} from '../styles/globalStyle';
import { formatDate } from '../utils/formatDateMessage';

const MessageItem = ({ name, imagePath, receivedAt, content, isLastMessage, isRead }) => {
  
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
        {isRead === false &&
        <View style={{position:'absolute', right:5, top:-2, width:12, height:12, borderRadius:6, backgroundColor:colors.Red}} />
        }
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
              {formatDate(receivedAt)}
            </Text>
          </View>
        </View>
        <Text style={[textStyles.M4, {color: colors.Black}]}>
          {content}
        </Text>
      </View>
      {isLastMessage ?
      <View style={{flexDirection:'row', alignItems:'center', paddingVertical:24}}>
        <View style={{flex:1, height:1, backgroundColor:colors.Gray04, marginHorizontal:8}} />
        <Text style={[textStyles.M4, {color: colors.Gray06}]}>
          이전 메시지
        </Text>
        <View style={{flex:1, height:1, backgroundColor:colors.Gray04, marginHorizontal:8}} />
      </View>
      :
      <View style={{height:16}} />
      }
    </View>
  );
};

export default MessageItem;
