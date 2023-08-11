import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "../Common/hooks/useDebounce";
import styles from "./StudentDiary.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Configuration, OpenAIApi } from "openai";
import TTSsentence from "../Common/TTSsentence";

export default function StudentTalking() {
  const [speechWord, setSpeechWord] = useState("");
  const { transcript, listening } = useSpeechRecognition();
  const debounceTerm = useDebounce(transcript, 2000);
  const [msg, setMsg] = useState(null);
  const [allTranscripts, setAllTranscripts] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [generatedDiary, setGeneratedDiary] = useState("");

  const navigate = useNavigate();
  
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [allConversations, setAllConversations] = useState([]);
  const [conversationCount, setConversationCount] = useState(0);
  
  const [isGeneratingDiary, setIsGeneratingDiary] = useState(false);
  
  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  useEffect(() => {
    async function makeRequest() {
      let text = `오늘 하루는 어떠셨나요?`;
      ttsMaker(text, 0);
      await delay(text.length * 250);
      SpeechRecognition.startListening();
    }
    makeRequest();
  }, []);

  useEffect(() => {
    setAllTranscripts(prev => prev + " " + transcript);
  }, [transcript]);

  useEffect(() => {
    if (debounceTerm) {
        setAllConversations(prev => [...prev, {type: 'user', content: debounceTerm}]);
        if (conversationCount < 3) {
          generateText(debounceTerm);
        }
    }
  }, [debounceTerm]);
  

  useEffect(() => {
    if (generatedText) {
      setAllConversations(prev => [...prev, {type: 'response', content: generatedText}]);
      setConversationCount(prev => prev + 1); // GPT-3 응답 후 카운트 증가
      async function ttsAndListen() {
        await ttsMaker(generatedText, 0);
        await delay(generatedText.length * 250);
        if (conversationCount < 3) { // 수정: 응답 2번 후에만 음성 입력 대기
          SpeechRecognition.startListening();
        }
      }
      ttsAndListen();
    }
  }, [generatedText]);

  useEffect(() => {
    if (conversationCount >= 3) {
      generateDiary();
      navigate("/diary", { state: { generatedDiary: generatedDiary } });
    }
  }, [conversationCount]);
  
  

  const generateText = async (message) => {
    if (!isGenerating) {
      setIsGenerating(true);
      try {
        const apiKey = "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";
        const configuration = new Configuration({
          apiKey: apiKey,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "하나의 질문" },
            {
              role: "user",
              content: `
              사용자가 하는 말을 듣고, 그에 맞게 하나의 질문을 응답받고 싶어.
              예를 들어, '오늘 날씨가 너무 더워서 병원갔다왔는데 너무 힘들다' 라고 하면
              '왜 병원에 다녀오셨어요?' 라는 질문을 응답받고 싶어.
              대화하는 것 처럼 자연스럽게 질문해줘야해.
              "${message}"에 대해 적절한 질문을 해줘!
              `,
            },
          ],
        });

        const generatedMessage = response.data.choices[0].message.content;
        setGeneratedText(generatedMessage);
        console.log(generatedMessage)
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const generateDiary = async () => {
    if (!isGeneratingDiary) {
      setIsGeneratingDiary(true);

      try {
        const apiKey = "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";

        const configuration = new Configuration({
          apiKey: apiKey,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "70대가 쓴 일기처럼 작성해줘." },
            {
              role: "user",
              content: `다음 내용을 짧은 4개의 문장으로 일기처럼 작성해줘 : ${allConversations}`,
            },
          ],
        });

        const diaryContent = response.data.choices[0].message.content;
        setGeneratedDiary(diaryContent); 
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsGeneratingDiary(false);
      }
    }
  };


  useEffect(() => {
    setSpeechWord(transcript);
  }, [transcript]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <div className={styles.text}></div>
          <div className={styles.microphone}>
            <h1>오늘 하루는 어떠셨나요?</h1>
            <p className={styles.volume}>{listening ? "🔊" : "🔇"}</p>
            
            {allConversations.map((conversation, index) => (
              <div key={index} className={conversation.type === 'user' ? styles.userMessage : styles.generatedMessage}>
                {conversation.content}
              </div>
            ))}
            
            {msg && <TTSsentence message={msg} />}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}