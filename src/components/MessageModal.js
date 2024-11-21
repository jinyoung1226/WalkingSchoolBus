import React from 'react';
import {View, Text, TouchableOpacity, Modal, InputAccessoryView} from 'react-native';
import CustomButton from './CustomButton';
import {colors, textStyles} from '../styles/globalStyle';
import { TextInput } from 'react-native-gesture-handler';
import XIcon from '../assets/icons/XIcon.svg';
const MessageModal = ({
  setModalVisible,
  modalVisible,
  onConfirm,
  value,
  setMessage,
  onChangeText,
}) => {
  const modalClose = () => {
    setModalVisible(false);
    setMessage('');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        modalClose();
      }}>
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            modalClose();
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{width: 32}}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: colors.White,
              borderRadius: 10,
              paddingVertical: 32,
              paddingHorizontal: 16,
              gap:32,
              elevation:5,
            }}
          >
            <View>
              <View style={{flexDirection:'row', marginTop:-16}}>
                <View style={{flex:1}}/>
                <TouchableOpacity
                  onPress={() => {
                    modalClose();
                  }}
                >
                  <XIcon color={colors.Black}/>
                </TouchableOpacity>
              </View>
              <Text
              style={[
                textStyles.SB1,
                {color: colors.Black, textAlign: 'center'},
              ]}>
              {"인솔자에게\n보낼 메세지를 작성해주세요"}
              </Text>
            </View>
            <View style={{backgroundColor:colors.Gray01, borderRadius:10, paddingHorizontal:16, minHeight:150, paddingVertical:8}}>
              <TextInput
                placeholder="메세지 내용을 작성해주세요"
                multiline={true}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={colors.Gray05}
                style={[textStyles.M4, {color:colors.Gray07}]}
              />
            </View>
            <CustomButton
              title={'메세지 전송하기'}
              onPress={onConfirm}
              type="confirm"
              disabled={value.length === 0}
              textStyle={[textStyles.SB1]}
            />
          </View>
          <TouchableOpacity
            style={{width: 32}}
            onPress={() => {
              modalClose();
            }}
          />
        </View>
        <View style={{flex: 1}}
          onPress={() => {
            modalClose();
          }}
        />
      </View>
    </Modal>
  );
};

export default MessageModal;
