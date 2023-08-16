import axios from "axios";

axios.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("accessToken");

    request.headers["Authorization"] = accessToken;

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const { response, config } = error;

    // 응답 받은 상태 코드가 401이라면
    if (response.status === 401) {
      const { data } = await axios.post("https://i9e206.p.ssafy.io/api/v1/private/auth/reissue", {
        // baseURL: 'http://localhost:8080',
        params: {
          // refresh 토큰으로 재발급 요청
          token: localStorage.getItem("accessToken"),
        },
      });

      const { accessToken } = data;
      console.log(data);
      //새 액세스 토큰을 세션스토리지에 저장
      localStorage.setItem("accessToken", accessToken);
      //새 액세스 토큰을 헤더에 설정
      config.headers["Authorization"] = accessToken;
      //재요청
      return await axios(config);
    } else if (response.status === 403) {
      alert("권한이 없는 사용자입니다!");
    }

    return Promise.reject(error);
  }
);

export default axios;

/* 사용 코드 ~~.js
import axios from "./api/authAxios.js"; // axios 테스트가 잘 안된다 싶으면 아래 axios 사용(인터셉터 미적용)
//import axios from "axios";

function App() {

  function login(){
    console.log("로그인 이벤트 발생");
    
    const body = {
      "identification": "string",
      "password": "string"
    };

    axios.post("http://localhost:8080/api/v1/auth/governments/login", body).then((response) => {
      console.log(response.data);
      console.log(response.data.data); //토큰 받아와짐
      
      if(response.data.status === 200){
        console.log("로그인 성공");

        localStorage.setItem("accessToken", response.data.data.token); //토큰 저장
      }else{
        console.log("로그인 실패 처리")
      }
      
    })

  }

  //async function logout(){
	function logout(){
    console.log("로그아웃 발생");

    await axios.post('http://localhost:8080/api/v1/private/auth/logout').then((response) => {
      console.log(response)
      if(response.data.status === 200){
        console.log("로그아웃 완료");
        localStorage.removeItem("accessToken"); //accessToken 지움
      }

    });
  }
  
  */
