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
  // [녹음]
  const { transcript, listening } = useSpeechRecognition();
  const debounceTerm = useDebounce(transcript, 2000);

  // debounceTerm내용을 allConversations에 저장할거야.
  // 3번 안됐으면 GPT에 보내서 질문을 만들거야.
  useEffect(() => {
    if (debounceTerm) {
      setAllConversations((prev) => [
        ...prev,
        { type: "user", content: debounceTerm },
      ]);
      console.log(allConversations);
      if (conversationCount < 3) {
        generateText(debounceTerm);
      }
    }
  }, [debounceTerm]);

  // [TTS]
  const [msg, setMsg] = useState(null);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // TTS 생성함수
  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  // TTS 첫 질문
  useEffect(() => {
    async function makeRequest() {
      let text = `오늘 하루는 어떠셨나요?`;
      ttsMaker(text, 0);
      await delay(text.length * 250);
      SpeechRecognition.startListening();
    }
    makeRequest();
  }, []);

  // [GPT]
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [allConversations, setAllConversations] = useState([]);
  const [conversationCount, setConversationCount] = useState(0);
  const [generatedDiary, setGeneratedDiary] = useState(""); //삭제예정

  // GPT에 사용자의 답변을 보내서 질문을 받아와, generatedMessage에 저장해
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
            {
              role: "system",
              content:
                "You are a helpful assistant. Whenever the user shares a statement or sentiment, ask a relevant and engaging question in response, using Korean honorifics (존댓말).",
            },
            {
              role: "user",
              content: `${message}`,
            },
          ],
        });

        const generatedMessage = response.data.choices[0].message.content;
        setGeneratedText(generatedMessage);
        console.log(generatedMessage);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // GPT에서 질문 받으면 -> 배열에 추가하고, TTS로 읽고, 녹음 시작 (두번째 질문부터)
  useEffect(() => {
    if (generatedText) {
      setAllConversations((prev) => [
        ...prev,
        { type: "response", content: generatedText },
      ]);
      setConversationCount((prev) => prev + 1); // GPT-3 응답 후 카운트 증가
      async function ttsAndListen() {
        await ttsMaker(generatedText, 0);
        await delay(generatedText.length * 250);
        if (conversationCount < 3) {
          // 수정: 응답 2번 후에만 음성 입력 대기
          SpeechRecognition.startListening();
        }
      }
      ttsAndListen();
    }
  }, [generatedText]);

  console.log(allConversations);

  // 페이지 이동, 수정예정
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAndNavigate() {
      if (conversationCount >= 3) {
        // 1. allConversations 배열에서 type이 'user'인 객체들만 필터링
        const userConversations = allConversations.filter(
          (convo) => convo.type === "user"
        );

        // 2. 이들의 content만 따로 모아 배열로 만듦
        const userContents = userConversations.map((convo) => convo.content);

        // 3. 만든 배열을 diary 페이지로 전달
        navigate("/diary", { state: { userConversations: userContents } });
      }
    }

    checkAndNavigate();
  }, [conversationCount]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <div className={styles.text}></div>
          <div className={styles.microphone}>
            <h1>오늘 하루는 어떠셨나요?</h1>
            <p className={styles.volume}>{listening ? "🔊" : "🔇"}</p>

            {allConversations.map((conversation, index) => (
              <div
                key={index}
                className={
                  conversation.type === "user"
                    ? styles.userMessage
                    : styles.generatedMessage
                }
              >
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
