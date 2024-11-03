import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
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
      transparent={true} // transparent를 true로 설정하여 배경을 투명하게
      visible={modalVisible}
      onRequestClose={() => {
        modalClose();
      }}>
      {/* 배경을 터치해도 반응하지 않도록 TouchableWithoutFeedback으로 감싸기 */}
      <TouchableWithoutFeedback>
        <View style={styles.modalOverlay}>
          {/* 모달 콘텐츠 영역을 터치 이벤트와 분리 */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 반투명한 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%', // 모달의 너비를 화면의 80%로 설정
    backgroundColor: colors.White,
    borderRadius: 10,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignSelf: 'center', // 수평 중앙 정렬
  },
});

export default SingleActionModal;
