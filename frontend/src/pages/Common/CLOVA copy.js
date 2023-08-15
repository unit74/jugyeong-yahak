import React, { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

export default function CLOVA({ message }) {
  const [audioURL, setAudioURL] = useState(null);
  // Howler.autoUnlock = false;

  useEffect(() => {
    console.log('useEffect triggered with message:', message);    
    fetchTTSMessage(message);
  }, [message]);


  const playAudio = () => {
    if (audioURL) {
      const sound = new Howl({
        src: [audioURL],
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
      const response = await fetch('http://127.0.0.1:3000/tts', {
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
      
      setAudioURL(newAudioURL);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return null
}
