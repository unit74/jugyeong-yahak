import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

import WordImgComponent from "../Common/WordImgComponent";
import WordNameComponent from "../Common/WordNameComponent";

//단어정보 표시 컴포넌트
export default function WordsListComponent() {
  const [wordsList, setWordsList] = useState(null);
  const wordIndex = useSelector((state) => state.wordIndexState);

  useEffect(() => {
    axios
      .get("https://i9e206.p.ssafy.io/api/v1/themes/8")
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
