import React from 'react';
import {View, Text, Modal} from 'react-native';
import CustomButton from './CustomButton';
import {colors, textStyles} from '../styles/globalStyle';

const SingleActionModal = ({
  setModalVisible,
  modalVisible,
  icon,
  title,
  subtitle,
  confirmTitle,
  onConfirm,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {}}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '80%',
            backgroundColor: colors.White,
            borderRadius: 10,
            paddingVertical: 32,
            paddingHorizontal: 16,
            alignSelf: 'center',
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
            onPress={() => {
              onConfirm();
              setModalVisible(false);
            }}
            type="confirm"
            textStyle={[textStyles.SB1]}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SingleActionModal;
