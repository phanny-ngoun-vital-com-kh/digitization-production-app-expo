import React, { useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '../Icon';
import { BaseStyle, useTheme } from 'app/theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '..';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void,
  isLoading: boolean
}

const ModalSubmit: React.FC<ModalProps> = ({ isVisible, onClose, onSubmit, isLoading }) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.model}>
          <View style={{ flexDirection: 'row' }}>
            <IconAntDesign name='exclamationcircle' color={'#E69B00'} size={25} />
            <Text body1 accentColor style={{ marginLeft: '3%' }}>Save Transfer Request record </Text>
          </View>
          <Text body2 style={{ marginTop: '2%', marginLeft: '7%' }}>Are you sure?</Text>
          <View style={styles.butuon_view}>
            <Button style={styles.button_cancel} styleText={{ color: 'black' }} onPress={onClose}>Cancel</Button>
            <Button style={styles.button} onPress={onSubmit} disabled={isLoading}>{isLoading ? (
              <ActivityIndicator color="white" /> // Display loading indicator when isLoading is true
            ) : (
              'OK'
            )}</Button>
          </View>
        </View>

      </View>
    </Modal>
  );
};

export default ModalSubmit;