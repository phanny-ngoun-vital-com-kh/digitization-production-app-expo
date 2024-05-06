import React, { useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from '../Icon';
import { BaseStyle, useTheme } from 'app/theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '..';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    textChange: (text: string) => void;
    onSubmit: () => void
}

const ModalReject: React.FC<ModalProps> = ({ isVisible, onClose, textChange, onSubmit }) => {
    // const loading= true
    const [textInputValue, setTextInputValue] = useState('');
    const [isReject, setIsReject] = useState(true);

    const handleTextChange = (text: string) => {
        setTextInputValue(text);
        textChange(text);
    };

    const handleSubmit = () => {
        if (!textInputValue) {
            setIsReject(false)
            return
        }
        onSubmit()
        setTextInputValue('')
    }

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
                        <Text body1 accentColor style={{ marginLeft: '3%' }}>Reject Form </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: '5%', marginLeft: '7%' }}>
                        <Text style={{ margin: 5, color: "red", fontSize: 18, marginTop: '-1%' }}>*</Text>
                        <Text body2 style={{}}>មូលហេតុ</Text>
                    </View>
                    <TextInput multiline={true} style={styles.input} onChangeText={handleTextChange} placeholder='Please Enter' placeholderTextColor={'gray'} />
                    {!textInputValue && !isReject &&(
                        <View style={{ width: '100%' , marginLeft: '7%'}}>
                            <Text caption1 errorColor>
                                សូមបំពេញមូលហេតុ
                            </Text>
                        </View>
                    )}
                    {/* <Text body2 style={{marginTop:'2%',marginLeft:'7%'}}>Are you sure?</Text> */}
                    <View style={styles.butuon_view}>
                        <Button style={styles.button_cancel} styleText={{ color: 'black' }} onPress={onClose}>Cancel</Button>
                        <Button style={styles.button} onPress={handleSubmit}>Submit</Button>
                    </View>
                </View>

            </View>
        </Modal>
    );
};

export default ModalReject;