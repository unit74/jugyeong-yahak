import React, { useState } from "react";

//단어읽기 문제 표시 페이지
export default function KarloTest() {
  const REST_API_KY = "e111e75cff4a0c7a2db44a44e924b89c";
  const prompt = "draw a tiger";
  const [img, setImg] = useState(null);

  const createImage = () => {
    fetch("https://api.kakaobrain.com/v2/inference/karlo/t2i", {
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
