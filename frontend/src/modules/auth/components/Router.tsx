import { Navigate, useLocation } from "react-router-dom";
import UserService from "../services/keycloakService";
import type { JSX } from "react";


export function AuthenticationRouter({ children }: { children: JSX.Element }) {
  const auth = UserService.isLoggedIn(); // kiểm tra đã đăng nhập

  if (auth) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export function PublicRouter({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const auth = UserService.isLoggedIn();

  if (!auth) {
    return children;
  } else {
    return <Navigate to="/" state={{ from: location }} />;
  }
}