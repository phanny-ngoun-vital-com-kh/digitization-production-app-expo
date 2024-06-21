import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';

const Barchartdialog = ({ visible, onClose, data = [] }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>Bar Chart</Dialog.Title>
        <Dialog.Content>
          {/* Add your bar chart here based on data */}
          <View style={styles.chartContainer}>
            {data.map((item, index) => (
              <View key={index} style={styles.bar}>
                <View style={{ height: item.value * 20, backgroundColor: item.color }} />
              </View>
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 200,
  },
  bar: {
    width: '20%',
  },
});

export default Barchartdialog;
