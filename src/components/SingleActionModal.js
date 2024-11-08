import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import CustomButton from './CustomButton';
import {colors, textStyles} from '../styles/globalStyle';
import {useNavigation} from '@react-navigation/native';

const SingleActionModal = ({
  setModalVisible,
  modalVisible,
  icon,
  title,
  subtitle,
  confirmTitle,
  onConfirm,
  isBackgroundclosable = true,
}) => {
  const modalClose = () => {
    if (isBackgroundclosable) {
      setModalVisible(false);
    }
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
            {subtitle && (
              <View>
                <View style={{height: 8}} />
                <Text
                  style={[
                    textStyles.R1,
                    {color: colors.Gray05, textAlign: 'center'},
                  ]}>
                  {subtitle}
                </Text>
              </View>
            )}
            <View style={{height: 24}} />
            <CustomButton
              title={confirmTitle}
              onPress={onConfirm}
              type="confirm"
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

export default SingleActionModal;
