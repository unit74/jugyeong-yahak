import React, { useEffect} from 'react';
import { Howl, Howler } from 'howler';

export default function CLOVA({ message }) {
  // 이놈이 제일 중요했네......
  // navigator.mediaDevices.getUserMedia 요청을 처리하는 useEffect 
  useEffect(() => {
    console.log('useEffect triggered with message:', message);    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        var audioContext = new AudioContext();  // 혹시 몰라서 있는게 좋음
        fetchTTSMessage(message);
        // 여기에 원하는 로직을 추가할 수 있습니다.
        // 예를 들면, 스트림에 관한 작업을 수행하거나 상태를 설정하는 등의 작업을 수행할 수 있습니다.
      })
      .catch(err => {
        console.error('Error accessing audio:', err);
      });
  }, [message]);

  const playAudio = (url) => {
    if (url) {
      const sound = new Howl({
        src: [url],
        format: ['mp3'],
        onplayerror: function() {
          sound.once('unlock', function() {
            sound.play();
          });
        }
      });
      sound.play();
    }
  };

  const fetchTTSMessage = async (msg) => {
    console.log('Trying to fetch TTS message with text:', msg);
    try {
      const response = await fetch('https://i9e206.p.ssafy.io/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: msg }),
      });
      console.log('Received response:', response.status);

      if (!response.ok) {
        console.warn('Received non-OK response. Status:', response.status);
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      console.log('Converted response to blob');

      const newAudioURL = URL.createObjectURL(blob);
      console.log('Created audio URL:', newAudioURL);
      
      playAudio(newAudioURL); // 실행!!!!!!!!!!!!!!!!!!!!!!
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return null;
}
