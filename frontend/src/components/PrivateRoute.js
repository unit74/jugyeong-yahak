import { Route, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PrivateRoute({ children }) {
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/facetest", { replace: true, state: { from: location } });
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.role === "ROLE_TEACHER")
      navigate("/teacher-main", { replace: true, state: { from: location } });
  }, [navigate, location]);

  return children;
}
