import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//단어읽기 문제 표시 페이지
export default function GovernmentLogin() {
  const navigate = useNavigate();

  const Login = async () => {
    await axios
      .post("https://i9e206.p.ssafy.io/api/v1/auth/governments/login", {
        identification: "string",
        password: "string",
      })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.data.token); //토큰 저장
        navigate("/governmentmain");
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => Login()}>로그인</button>
      </header>
    </div>
  );
}
