import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import { useDebounce } from "../Common/hooks/useDebounce";
import styles from "./StudentDiary.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Configuration, OpenAIApi } from "openai";;


export default function StudentTalking() {
  // 변수
  const [generatedText, setGeneratedText] = useState('');
  const [speechWord, setSpeechWord] = useState('');
  const debounceTerm = useDebounce(speechWord, 2000);
  const [isGenerating, setIsGenerating] = useState(false); 

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
  
  // 2. transcript를 speechWord에 저장
  useEffect(() => {
    setSpeechWord(transcript); 
  }, [transcript]);

  //함수

  // 1. API요청 함수
  const generateText = async () => {
    if (!isGenerating) {
      setIsGenerating(true);

      try {
        const apiKey = '';

        const configuration = new Configuration({
          apiKey: apiKey,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {"role": "system", "content": "네 문장으로 짧게, 할머니가 쓴 일기처럼 작성해줘."},
            {role: "user", content: debounceTerm}
          ],
        });

        const generatedMessage = response.data.choices[0].message.content;
        setGeneratedText(generatedMessage);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };


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
