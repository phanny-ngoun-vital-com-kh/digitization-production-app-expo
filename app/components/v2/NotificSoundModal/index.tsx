// import React, { useEffect, useRef, useState } from 'react';
// import { Modal, View, Vibration } from 'react-native';
// import Icon from '../Icon';
// import { BaseStyle, useTheme } from 'app/theme-v2';
// import styles from './styles';
// import { Text, TextInput, Button } from '..';
// import Sound from 'react-native-sound';
// import IconAntDesign from 'react-native-vector-icons/AntDesign';

// interface ModalProps {
//     isVisible: boolean;
//     onClose: () => void;
//     title: string,
//     message: string,
//     color: string
// }

// const NotificSoundModal: React.FC<ModalProps> = ({ isVisible, onClose, message, title, color }) => {
//     Sound.setCategory('Playback');
//     const [isPlaying, setIsPlaying] = useState(false);
//     const soundRef = useRef(null);
//     const ONE_SECOND_IN_MS = 1000;
//     const PATTERN = [
//         1 * ONE_SECOND_IN_MS,
//         2 * ONE_SECOND_IN_MS,
//         3 * ONE_SECOND_IN_MS,
//     ];

//     const shadowStyle = () => {
//         return {
//             shadowColor: color,
//             shadowOffset: {
//                 width: 0,
//                 height: 2,
//             },
//             shadowOpacity: 0.25,
//             shadowRadius: 3.84,
//             elevation: 50,
//         };
//     };

//     useEffect(() => {
//         if (isVisible == true) {
//             setIsPlaying(true)
//         }
//     }, [isVisible])
//     useEffect(() => {
//         soundRef.current = new Sound('ding.mp3', Sound.MAIN_BUNDLE, (error) => {
//             if (error) {
//                 console.log('failed to load the sound', error);
//                 return;
//             }
//             // if loaded successfully
//             console.log('duration in seconds: ' + soundRef.current.getDuration() + 'number of channels: ' + soundRef.current.getNumberOfChannels());
//             soundRef.current.setVolume(1);
//             soundRef.current.setNumberOfLoops(-1);
//             if (isPlaying) {
//                 soundRef.current.play((success) => {
//                     if (success) {
//                         Vibration.vibrate(PATTERN, true)
//                         console.log('successfully finished playing');
//                     } else {
//                         console.log('playback failed due to audio decoding errors');
//                     }
//                 });
//             }

//         })
//         return () => {
//             if (soundRef.current) {
//                 soundRef.current.stop();
//                 soundRef.current.release();
//             }
//         };
//     }, [isPlaying]);

//     const stopSound = () => {
//         setIsPlaying(false);
//         Vibration.cancel()
//         onClose()
//     };
//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={isVisible}
//             onRequestClose={onClose}
//         >
//             <View style={styles.container}>
//                 <View style={[styles.model, { borderWidth: 1, borderColor: color }, shadowStyle()]}>
//                     <View style={{ flexDirection: 'row' }}>
//                         <IconAntDesign name='exclamationcircle' color={'#E69B00'} size={30} />
//                         <Text style={styles.title}>{title}</Text>
//                     </View>
//                     <Text style={styles.message}>{message}</Text>
//                     <View style={styles.button_view}>
//                         <Button style={styles.button_cancel} onPress={stopSound}>បាទ</Button>
//                     </View>
//                 </View>

//             </View>
//         </Modal>
//     );
// };

// export default NotificSoundModal;

import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Vibration } from 'react-native';
import { Text,  Button } from '..';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
// import { Audio } from 'expo-av';
import styles from './styles';
import CustomAudioPlayer from './CustomAudioPlayer';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  title: string;
  color: string;
}

const NotificSoundModal: React.FC<ModalProps> = ({ isVisible, onClose, message, title, color }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // const soundRef = useRef<Audio.Sound | null>(null);
  const ONE_SECOND_IN_MS = 1000;
  const PATTERN = [1 * ONE_SECOND_IN_MS, 2 * ONE_SECOND_IN_MS, 3 * ONE_SECOND_IN_MS];

  useEffect(() => {
    if (isVisible) {
      setIsPlaying(true);
    }
  }, [isVisible]);

  // useEffect(() => {
  //   const loadSound = async () => {
  //     try {
  //       const { sound } = await Audio.Sound.createAsync(
  //         require('./ding.mp3')
  //       );
  //       soundRef.current = sound;
  //       await soundRef.current.setVolumeAsync(1);
  //       await soundRef.current.setIsLoopingAsync(true);
  //       if (isPlaying) {
  //         await soundRef.current.playAsync();
  //         Vibration.vibrate(PATTERN, true);
  //       }
  //     } catch (error) {
  //       console.error('Failed to load the sound', error);
  //     }
  //   };

  //   loadSound();

  //   return async () => {
  //     if (soundRef.current) {
  //       await soundRef.current.stopAsync();
  //       await soundRef.current.unloadAsync();
  //     }
  //   };
  // }, [isPlaying]);

  const stopSound = async () => {
    setIsPlaying(false);
    Vibration.cancel();
    onClose();
  };

  const shadowStyle = () => {
    return {
        shadowColor: color,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 50,
    };
};

  return (
    <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={[styles.model, { borderWidth: 1, borderColor: color }, shadowStyle()]}>
                    <View style={{ flexDirection: 'row' }}>
                        <IconAntDesign name='exclamationcircle' color={'#E69B00'} size={30} />
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.button_view}>
                        <Button style={styles.button_cancel} onPress={stopSound}>បាទ</Button>
                    </View>
                </View>

            </View>
            {isPlaying?<CustomAudioPlayer onPress={stopSound}/>:<></>}
        </Modal>
  );
};

export default NotificSoundModal;

