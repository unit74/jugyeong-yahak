import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./StudentDiary.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Configuration, OpenAIApi } from "openai";
import TTSsentence from "../Common/TTSsentence";
import axios from "axios";

export default function StudentTalking() {
  // 음성인식 관련
  const { transcript, listening } = useSpeechRecognition();
  const [generatedText, setGeneratedText] = useState("");
  const [allConversations, setallConversations] = useState("");
  const [diaryEntry, setDiaryEntry] = useState("");
  // TTS 관련
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState(null);
  // 이미지 생성 관련
  const [img, setImg] = useState(null);

  const navigate = useNavigate();

  const REST_API_KY = "e111e75cff4a0c7a2db44a44e924b89c";

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    async function makeRequest(data) {
      await delay(1000);

      ttsMaker(data, 0);
      await delay(data.length * 250);
      ttsMaker("", 0);

      SpeechRecognition.startListening();
      await delay(4000);
      SpeechRecognition.stopListening();

      setCount(count + 1);
    }

    if (count === 0) {
      makeRequest("오늘 하루는 어떠셨나요?");
    } else if (count === 1) {
      helpGpt(transcript);
    } else if (count === 2) {
      makeRequest(generatedText);
    } else if (count === 3) {
      helpGpt(transcript);
    } else if (count === 4) {
      makeRequest(generatedText);
    } else if (count === 5) {
      generateDiary(transcript);
    } else {
      makeImg();
    }
  }, [count]);

  const helpGpt = async (message) => {
    console.log("사용자 : " + message);

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
    setallConversations(allConversations + message + ".\n" + generatedMessage + ".\n");
    setCount(count + 1);
    console.log("gpt : " + generatedMessage);
  };

  const generateDiary = async (message) => {
    console.log("사용자 : " + message);

    setallConversations(allConversations + message + ".\n");

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
            "You are a helpful assistant. Based on the provided user statements, generate a diary entry in 4 sentences and within 150 characters, written as if by a 70-year-old elderly person. The tone should remain positive and optimistic.",
        },
        {
          role: "user",
          content: allConversations + message + ". ",
        },
      ],
    });

    setDiaryEntry(response.data.choices[0].message.content);
    setCount(count + 1);
  };

  const makeImg = async () => {
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
            "영어로 번역하는데 총 띄어 쓰기 포함해서 글자수가 200개가 안되게 축약해서 번역해줘",
        },
        {
          role: "user",
          content: diaryEntry,
        },
      ],
    });

    const translatedDiary = response.data.choices[0].message.content;
    const prompt = "drawing done with a pencil, only scenery, in color" + translatedDiary;
    createImage(prompt);
  };

  const createImage = (prompt) => {
    console.log(prompt);
    console.log("호출됨");
    fetch("https://api.kakaobrain.com/v2/inference/karlo/t2i", {
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${REST_API_KY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.substr(0, Math.min(250, prompt.length)),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setImg(data.images[0].image);
        // navigate("/diary", { state: { diaryEntry, img } });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    async function saveDiary() {
      await axios
        .post(`https://i9e206.p.ssafy.io/api/v1/diaries`, {
          content: diaryEntry,
          imageUrl: img,
        })
        .then(() => {
          navigate("/diary", { state: { diaryEntry, img } });
        });
    }

    if (img !== null) {
      saveDiary();
    }
  }, [img]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <div className={styles.text}></div>
          <div className={styles.microphone}>
            <h1>오늘 하루는 어떠셨나요?</h1>
            <p className={styles.volume}>{listening ? "🔊" : "🔇"}</p>

            {allConversations.split(".\n").map((conversation, index) => (
              <div
                key={index}
                className={index % 2 === 0 ? styles.userMessage : styles.generatedMessage}
              >
                {conversation}
              </div>
            ))}

            {img && <img src={img}></img>}

            {msg && <TTSsentence message={msg} />}

            {diaryEntry && <p>{diaryEntry}</p>}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
