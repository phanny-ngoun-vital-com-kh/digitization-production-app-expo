import React, { useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Button from '../Button';
import styles from './styles';

interface CustomAudioProps {
    onPress: () => void;
  }

const CustomAudioPlayer : React.FC<CustomAudioProps> = ({ onPress }) => {
  const webViewRef = useRef(null);

  const stopAudio = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage('stopAudio');
      onPress()
    }
  };

  const webViewScript = `
    document.addEventListener('message', function(e) {
      if (e.data === 'stopAudio') {
        var audio = document.querySelector('audio');
        if (audio) {
          audio.pause();
        }
      }
    });
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={{ flex: 1 ,display:'none'}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false} // Allow autoplay
        useWebKit={true} // Use WebKit for better compatibility
        source={{ html: `
          <audio controls autoplay loop>
            <source src="https://pixabay.com/sound-effects/download/audio-electronic-alarm-clock-151927.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <script>${webViewScript}</script>
        ` }}
      />
      <Button onPress={stopAudio} style={{display:'none'}}>Stop Audio</Button>
    </View>
  );
};

export default CustomAudioPlayer;
