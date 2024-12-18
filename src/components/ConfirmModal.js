import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import CustomButton from './CustomButton';
import {colors, textStyles} from '../styles/globalStyle';

const ConfirmModal = ({
  setModalVisible,
  modalVisible,
  icon,
  title,
  subtitle,
  cancelTitle,
  confirmTitle,
  onCancel,
  onConfirm,
  confirmDisabled = false,
}) => {
  const modalClose = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        modalClose();
      }}>
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            modalClose();
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{width: 32}}
            onPress={() => {
              modalClose();
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: colors.White,
              borderRadius: 10,
              paddingVertical: 32,
              paddingHorizontal: 16,
            }}>
            <View style={{alignItems: 'center'}}>{icon}</View>
            <View style={{height: 24}} />
            <Text
              style={[
                textStyles.SB1,
                {color: colors.Black, textAlign: 'center'},
              ]}>
              {title}
            </Text>
            {subtitle}
            <View style={{height: 24}} />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <CustomButton
                  title={cancelTitle}
                  onPress={onCancel}
                  type="cancel"
                  textStyle={[textStyles.SB3]}
                />
              </View>
              <View style={{width: 8}} />
              <View style={{flex: 1}}>
                <CustomButton
                  title={confirmTitle}
                  onPress={onConfirm}
                  type="confirm"
                  textStyle={[textStyles.SB3]}
                  disabled={confirmDisabled}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{width: 32}}
            onPress={() => {
              modalClose();
            }}
          />
        </View>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            modalClose();
          }}
        />
      </View>
    </Modal>
  );
};

export default ConfirmModal;
