import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보를 삭제합니다.
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");

    // 사용자를 로그인 페이지로 리디렉션합니다.
    navigate("/facetest");
  }, [navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
