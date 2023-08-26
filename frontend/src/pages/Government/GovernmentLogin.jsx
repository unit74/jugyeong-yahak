import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//단어읽기 문제 표시 페이지
const BASE_HTTP_URL = process.env.REACT_APP_BASE_HTTP_URL;

export default function GovernmentLogin() {
  const navigate = useNavigate();

  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await axios
      .post(`${BASE_HTTP_URL}/auth/governments/login`, {
        identification: identification,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.data.token); //토큰 저장
        navigate("/governmentmain");
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <label>
            아이디:
            <input
              type="text"
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            비밀번호:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <button onClick={handleLogin}>로그인</button>
      </header>
    </div>
  );
}
