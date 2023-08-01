import axios from "axios";

const instance = axios.create({
    baseURL: "api",
    params: {
        api_key: "", // 백에서 주는 거
        language: "ko-KR",
    }
})

export default instance;