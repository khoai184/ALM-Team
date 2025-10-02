import { useState } from "react";
import "../../../App.css";
import "../../../global.css";
import CGlogo from "../../../assets/codegymlogo.png";
import BG from "../../../assets/codegym.png"; 
import UserService from "../services/keycloakService";
import { api, type SignupData } from "../../../services/api";
import { loginWithUsernamePassword } from "../services/authApi";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login");
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayContent, setOverlayContent] = useState<"login" | "signup">("login");
  const [usernameOrEmail, setUsernameOrEmail] = useState(""); // Username hoặc email
  const [password, setPassword] = useState(""); // Thêm state cho password
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // State cho form đăng ký
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    agreeTerms: false
  });
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [isSigningUp, setIsSigningUp] = useState(false);

  const toggleMode = (signup: boolean) => {
    setIsAnimating(true);
    setTimeout(() => setOverlayContent(signup ? "signup" : "login"), 200);
    setIsSignup(signup);
    setTimeout(() => setActiveForm(signup ? "signup" : "login"), 350);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleSSOLogin = () => {
    UserService.doLogin();
  };

  // Validation cho form đăng ký
  const validateSignupForm = () => {
    const errors: Record<string, string> = {};
    
    if (!signupData.username.trim()) {
      errors.username = "Username is required";
    } else if (signupData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    
    if (!signupData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!signupData.agreeTerms) {
      errors.agreeTerms = "You must agree to the terms";
    }
    
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler cho input changes
  const handleSignupInputChange = (field: string, value: string | boolean) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (signupErrors[field]) {
      setSignupErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handler cho đăng ký
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }
    
    setIsSigningUp(true);
    try {
      // Nếu API trả về 2xx, request() sẽ resolve → coi như thành công
      const response = await api.signup(signupData as SignupData);
      console.log("Signup response:", response);

      // Reset form và chuyển về login
      setSignupData({
        username: "",
        email: "",
        password: "",
        agreeTerms: false
      });
      toggleMode(false);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Parse error message
      let errorMessage = "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.";
      
      if (error.message && error.message.includes("HTTP")) {
        const statusCode = error.message.match(/HTTP (\d+)/)?.[1];
        if (statusCode === "400") {
          errorMessage = "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.";
        } else if (statusCode === "409") {
          errorMessage = "Email hoặc username đã tồn tại.";
        } else if (statusCode === "404") {
          errorMessage = "Không tìm thấy API endpoint. Vui lòng kiểm tra backend.";
        } else if (statusCode === "500") {
          errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSigningUp(false);
    }
  };

  // Xử lý đăng nhập thường
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Gọi API đăng nhập: nếu trả về 2xx coi như thành công
      const data = await loginWithUsernamePassword(usernameOrEmail, password);

      // Lưu token và user info từ response mới
      if (data.data?.token) {
        localStorage.setItem("auth_token", data.data.token);
      }
      if (data.data) {
        localStorage.setItem("user_info", JSON.stringify({
          id: data.data.id,
          email: data.data.email,
          username: data.data.username,
          role: data.data.role
        }));
      }

      // Redirect đến trang chủ theo yêu cầu
      window.location.href = "http://localhost:5173";
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Sai username/email hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay tối nền */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Container tổng */}
      <div className="relative w-[1000px] h-[600px] rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* LOGIN FORM */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center
            transition-all duration-700 ease-in-out
            ${
              isSignup
                ? "-translate-x-full opacity-0"
                : "translate-x-0 opacity-100 z-10"
            }
            bg-white
          `}
        >
          {activeForm === "login" && (
            <form className="w-4/5 max-w-sm space-y-4" onSubmit={handleLogin}>
              <img src={CGlogo} alt="CodeGym Logo" className="h-10 mb-6" />

              <input
                type="text"
                placeholder="Username hoặc Email"
                className="input-style"
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input-style"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-indigo-600" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-indigo-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                className="btn-primary w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                className="btn-primary w-full flex items-center justify-center gap-2"
                onClick={handleSSOLogin}
              >
                <img src="src/assets/iconG.png" className="w-5 h-5" />
                <span>Login with CodeGym ID</span>
              </button>
            </form>
          )}
        </div>

        {/* SIGNUP FORM */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center
            transition-all duration-700 ease-in-out
            ${
              isSignup
                ? "translate-x-0 opacity-100 z-10"
                : "translate-x-full opacity-0"
            }
            bg-white
          `}
        >
          {activeForm === "signup" && (
            <form className="w-4/5 max-w-sm space-y-4" onSubmit={handleSignup}>
              <img src={CGlogo} alt="CodeGym Logo" className="h-10 mb-6" />

              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className={`input-style ${signupErrors.username ? 'border-red-500' : ''}`}
                  value={signupData.username}
                  onChange={(e) => handleSignupInputChange('username', e.target.value)}
                />
                {signupErrors.username && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.username}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className={`input-style ${signupErrors.email ? 'border-red-500' : ''}`}
                  value={signupData.email}
                  onChange={(e) => handleSignupInputChange('email', e.target.value)}
                />
                {signupErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className={`input-style ${signupErrors.password ? 'border-red-500' : ''}`}
                  value={signupData.password}
                  onChange={(e) => handleSignupInputChange('password', e.target.value)}
                />
                {signupErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.password}</p>
                )}
              </div>

              <div className="flex items-center text-sm">
                <input 
                  type="checkbox" 
                  className="accent-indigo-600 mr-2"
                  checked={signupData.agreeTerms}
                  onChange={(e) => handleSignupInputChange('agreeTerms', e.target.checked)}
                />
                <span>I agree with Terms and Privacy Policy</span>
              </div>
              {signupErrors.agreeTerms && (
                <p className="text-red-500 text-xs">{signupErrors.agreeTerms}</p>
              )}

              <button 
                type="submit"
                className="btn-primary w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? "Signing Up..." : "Sign Up"}
              </button>

              <p
                className="text-indigo-600 text-sm underline cursor-pointer"
                onClick={() => toggleMode(false)}
              >
                Already have an account?
              </p>
            </form>
          )}
        </div>

        {/* OVERLAY */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full z-30
            flex flex-col justify-center text-white px-10
            transition-transform duration-700 ease-in-out
            ${isSignup ? "translate-x-0" : "translate-x-full"}
            bg-indigo-700/80 backdrop-blur-sm
          `}
        >
          <div
            className={`transition-opacity duration-300 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            {overlayContent === "signup" ? (
              <>
                <div className="flex items-center mb-6 text-lg font-bold ">
                  <img src="/src/assets/logoTIM.png" className="h-10 mr-2" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Hello, welcome</h1>
                <p className="mb-6 text-sm max-w-xs">
                  Cầu nối giữa CodeGym và học viên về mọi mặt, nơi cung cấp
                  thông tin và tương tác nhằm mang lại môi trường học tập và
                  hoạt động năng suất nhất.
                </p>
                <button
                  onClick={() => toggleMode(false)}
                  className="btn-outline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center mb-6 text-lg font-bold top-[50px] left-[50px] absolute">
                  <img src="/src/assets/logoTIM.png" className="h-10 mr-2" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                <p className="mb-6 text-sm max-w-xs">
                  Cầu nối giữa CodeGym và học viên về mọi mặt, nơi cung cấp
                  thông tin và tương tác nhằm mang lại môi trường học tập và
                  hoạt động năng suất nhất.
                </p>
                <button
                  onClick={() => toggleMode(true)}
                  className="btn-outline bottom-[180px] right absolute"
                >
                  Create a new account?
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}