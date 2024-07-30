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
  textChange: (text: string) => void;
  onSubmit: () => void;
  loading: boolean
}

const ModalApprove: React.FC<ModalProps> = ({ isVisible, onClose, textChange, onSubmit, loading }) => {
  // const loading= true
  const [textInputValue, setTextInputValue] = useState('');

  const handleTextChange = (text: string) => {
    setTextInputValue(text);
    textChange(text);
  };

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
            <Text body1 accentColor style={{ marginLeft: '3%' }}>Approve Form </Text>
          </View>
          <Text body2 style={{ marginTop: '5%', marginLeft: '7%' }}>Remark</Text>
          <TextInput multiline={true} style={styles.input} onChangeText={handleTextChange} placeholder='Please Enter' placeholderTextColor={'gray'} />
          {/* <Text body2 style={{marginTop:'2%',marginLeft:'7%'}}>Are you sure?</Text> */}
          <View style={styles.butuon_view}>
            <Button style={styles.button_cancel} styleText={{ color: 'black' }} onPress={onClose}>Cancel</Button>
            <Button style={styles.button} onPress={onSubmit} disabled={loading}>
              {loading ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 17 }}>Submit</Text><ActivityIndicator color="white" /></View>
              ) : (
                <Text style={{ color: '#fff' }}>Submit</Text>
              )}</Button>
          </View>
        </View>

      </View>
    </Modal>
  );
};

export default ModalApprove;