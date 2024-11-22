// components/GlobalModal.tsx
import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { useModalStore } from '../store/modalStore';
import { colors } from '../styles/globalStyle';


const GlobalModal = () => {
  const { visible, content, hideModal } = useModalStore();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={hideModal}
    >
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            hideModal();
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{width: 32}}
            onPress={() => {
              hideModal();
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
            {content}
          </View>
          <TouchableOpacity
            style={{width: 32}}
            onPress={() => {
              hideModal();
            }}
          />
        </View>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            hideModal();
          }}
        />
      </View>
    </Modal>
  );
};

export default GlobalModal;
