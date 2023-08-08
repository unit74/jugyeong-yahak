import React, { useEffect } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export default function TTS({ ssml }) {
  useEffect(() => {
    
    // 오디오 권한 요청
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log('Access granted!');

        // 권한이 허용된 후에 TTS 작업을 시작
        const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
        const speechConfig = sdk.SpeechConfig.fromSubscription("635f31a684ac4b7db7b8c2239cbc3773", "koreacentral");
        speechConfig.speechSynthesisVoiceName = "ko-KR-InJoonNeural";
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

        synthesizer.speakSsmlAsync(
          ssml,
          result => {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              console.log("synthesis finished.");
            } else {
              console.error("Speech synthesis canceled, " + result.errorDetails);
            }
            synthesizer.close();
          },
          err => {
            console.trace("err - " + err);
            synthesizer.close();
          }
        );

      })
      .catch(err => {
        console.error('Access denied:', err);
      });
    
  }, [ssml]);

  return null;
}
