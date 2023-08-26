import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

import WordImgComponent from "../Common/WordImgComponent";
import WordNameComponent from "../Common/WordNameComponent";

const BASE_HTTP_URL = process.env.REACT_APP_BASE_HTTP_URL;

//단어정보 표시 컴포넌트
export default function WordsListComponent() {
  const [wordsList, setWordsList] = useState(null);
  // const wordIndex = useSelector((state) => state.wordIndexState);
  const wordIndex = 4;

  useEffect(() => {
    axios
      .get(`${BASE_HTTP_URL}/themes/8`)
      .then((response) => {
        // 바꾸기
        setWordsList(response.data.data.wordList);
      })
      .catch((error) => console.error(`Error: ${error}`));
  }, []);
  console.log(wordsList);

  return (
    <div>
      {wordsList &&
        wordsList.map((item, index) => (
          <React.Fragment key={index}>
            <WordImgComponent wordImg={item.wordImageUrl} />
            <WordNameComponent wordName={item.word} />
          </React.Fragment>
        ))}
    </div>
  );
}
