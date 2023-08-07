import React, { useEffect, useRef } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export default function TTS({ text }) {
  const audioElement = useRef();

  useEffect(() => {
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const speechConfig = sdk.SpeechConfig.fromSubscription("635f31a684ac4b7db7b8c2239cbc3773", "koreacentral");
    speechConfig.speechSynthesisVoiceName = "ko-KR-InJoonNeural";

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      text,
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
  }, [text]);

  return <audio ref={audioElement} autoPlay={true} />;
}
