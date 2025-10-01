import { api } from "../../../services/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

const LOGIN_PATH = (import.meta.env.VITE_LOGIN_PATH as string) || "/auth/login";

export const loginWithUsernamePassword = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(LOGIN_PATH, {
      email,
      password
    });
    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    
    // Parse error message from response
    if (error.message && error.message.includes("HTTP")) {
      const statusCode = error.message.match(/HTTP (\d+)/)?.[1];
      if (statusCode === "401") {
        throw new Error("Email hoặc mật khẩu không đúng");
      } else if (statusCode === "404") {
        throw new Error("Không tìm thấy API endpoint. Vui lòng kiểm tra backend.");
      } else if (statusCode === "500") {
        throw new Error("Lỗi server. Vui lòng thử lại sau.");
      }
    }
    
    throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
  }
};
