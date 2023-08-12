import { Route, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PrivateRoute() {
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/facetest", { replace: true, state: { from: location } });
    }
  }, [navigate, location]);

  return <Outlet />;
}
