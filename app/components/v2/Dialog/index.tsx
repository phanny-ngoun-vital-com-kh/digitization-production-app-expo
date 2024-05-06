import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
const ConfirmDialog = ({ title, message, buttons }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dialog}>
        <View style={{ flexDirection: 'row' }}>
          <IconAntDesign name='exclamationcircle' color={'#E69B00'} size={20} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={button.onPress}
              style={[styles.button, { backgroundColor: button.backgroundColor, borderColor: 'gray', borderWidth: button.borderWidth }]}
            >
              {button.isLoading ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={styles.buttonText}>{button.text}</Text>
                  <ActivityIndicator color="white" />
                </View>
              ) : (
                <Text style={[styles.buttonText, { color: button.color }]}>{button.text}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ConfirmDialog;
