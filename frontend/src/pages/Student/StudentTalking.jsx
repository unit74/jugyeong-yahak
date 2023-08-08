import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import { useDebounce } from "../Common/hooks/useDebounce";
import styles from "./StudentDiary.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';


export default function StudentTalking() {
  // 변수
  const [generatedText, setGeneratedText] = useState('');
  const [speechWord, setSpeechWord] = useState('');
  const debounceTerm = useDebounce(speechWord, 2000);

  // 음성 인식
  const {
    transcript, 
    listening,
  } = useSpeechRecognition();
  
  // useEffect
  // 1. 마운트 후 0.8초 뒤 녹음 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      SpeechRecognition.startListening({ continuous: true });
    }, 800); 
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    setSpeechWord(transcript); 
  }, [transcript]);



  async function generateText() {
    const configuration = new Configuration({
      apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
  
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `다음 내용을 4줄짜리 짧은 일기로 만들어줘 : ${debounceTerm}`, // 원하는 프롬프트로 수정
        max_tokens: 7,
        temperature: 0,
      });
  
      const generatedText = response.data.choices[0].text;
      console.log("Generated Text:", generatedText);
    } catch (error) {
      console.error("Error:", error);
    }
  
  }


  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>    
          <div className={styles.text}>
          </div>
          <div className={styles.microphone}>
            <p className={styles.volume}>{listening ? "🔊" : "🔇"}</p>
            <p>{transcript}</p>

            <button onClick={generateText}>Generate Text</button>
            <div>
              <h1>완성된 일기</h1>
              {generatedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
