import { api } from "../../../services/api";

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    username: string;
    role: 'student' | 'teacher' | 'admin';
    token: string;
  };
}

const LOGIN_PATH = (import.meta.env.VITE_LOGIN_PATH as string) || "/auth/login";

export const loginWithUsernamePassword = async (usernameOrEmail: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(LOGIN_PATH, {
      usernameOrEmail,
      password
    });
    return response;
  } catch (error: unknown) {
    console.error("Login API error:", error);
    
    // Parse error message from response
    if (error instanceof Error && error.message && error.message.includes("HTTP")) {
      const statusCode = error.message.match(/HTTP (\d+)/)?.[1];
      if (statusCode === "401") {
        throw new Error("Username/Email hoặc mật khẩu không đúng");
      } else if (statusCode === "404") {
        throw new Error("Không tìm thấy API endpoint. Vui lòng kiểm tra backend.");
      } else if (statusCode === "500") {
        throw new Error("Lỗi server. Vui lòng thử lại sau.");
      }
    }
    
    throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
  }
};
