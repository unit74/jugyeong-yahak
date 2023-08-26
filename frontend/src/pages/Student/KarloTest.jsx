import React, { useState } from "react";

//단어읽기 문제 표시 페이지
const BASE_KARLO_URL = process.env.REACT_APP_BASE_KARLO_URL;

export default function KarloTest() {
  const REST_API_KY = process.env.REACT_APP_KARLO_API_KEY;
  const prompt = "draw a tiger";
  const [img, setImg] = useState(null);

  const createImage = () => {
    fetch(`${BASE_KARLO_URL}/t2i`, {
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${REST_API_KY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setImg(data.images[0].image);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => createImage()}>버튼</button>
        {img && <img src={img}></img>}
      </header>
    </div>
  );
}
