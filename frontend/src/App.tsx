import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import UserService from "./modules/auth/services/keycloakService"; // sửa path nếu khác

export default function App() {
  useEffect(() => {
    UserService.initKeycloak(
      () => {
        console.log("Keycloak initialized!", UserService.isLoggedIn());
      },
      () => {
        console.warn("User not authenticated");
      }
    );
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
