import { useState } from "react";
import "../../../App.css";
import "../../../global.css";
import CGlogo from "../../../assets/codegymlogo.png";
import BG from "../../../assets/codegym.png"; // nền toàn trang

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login");
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayContent, setOverlayContent] = useState<"login" | "signup">("login");

  const toggleMode = (signup: boolean) => {
    setIsAnimating(true);
    setTimeout(() => setOverlayContent(signup ? "signup" : "login"), 200);
    setIsSignup(signup);
    setTimeout(() => setActiveForm(signup ? "signup" : "login"), 350);
    setTimeout(() => setIsAnimating(false), 700);
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
            ${isSignup ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100 z-10"}
            bg-white
          `}
        >
          {activeForm === "login" && (
            <form className="w-4/5 max-w-sm space-y-4">
              <img src={CGlogo} alt="CodeGym Logo" className="h-10 mb-6" />

              <input type="email" placeholder="Email address" className="input-style" />
              <input type="password" placeholder="Password" className="input-style" />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-indigo-600" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-indigo-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button className="btn-primary w-full">Login</button>

              <p
                className="text-indigo-600 text-sm underline cursor-pointer"
                onClick={() => toggleMode(true)}
              >
                Don’t have an account?
              </p>

              <div className="flex items-center justify-center gap-4 mt-4">
                <button type="button" className="btn-social bg-red-500">Google</button>
                <button type="button" className="btn-social bg-blue-600">Facebook</button>
              </div>
            </form>
          )}
        </div>

        {/* SIGNUP FORM */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center
            transition-all duration-700 ease-in-out
            ${isSignup ? "translate-x-0 opacity-100 z-10" : "translate-x-full opacity-0"}
            bg-white
          `}
        >
          {activeForm === "signup" && (
            <form className="w-4/5 max-w-sm space-y-4">
              <img src={CGlogo} alt="CodeGym Logo" className="h-10 mb-6" />

              <input type="text" placeholder="Username" className="input-style" />
              <input type="email" placeholder="Email address" className="input-style" />
              <input type="password" placeholder="Password" className="input-style" />

              <div className="flex items-center text-sm">
                <input type="checkbox" className="accent-indigo-600 mr-2" />
                <span>I agree with Terms and Privacy Policy</span>
              </div>

              <button className="btn-primary w-full">Sign Up</button>

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
                <div className="flex items-center mb-6 text-lg font-bold">
                  <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                  TIM
                </div>
                <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
                <p className="mb-6 text-sm max-w-xs">
                  Cầu nối giữa CodeGym và học viên về mọi mặt, nơi cung cấp thông tin và tương tác nhằm mang lại môi trường học tập và hoạt động năng suất nhất.
                </p>
                <button onClick={() => toggleMode(false)} className="btn-outline">
                  Sign In
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center mb-6 text-lg font-bold">
                  <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                  TIM
                </div>
                <h1 className="text-4xl font-bold mb-4">Hello, welcome!</h1>
                <p className="mb-6 text-sm max-w-xs">
                  Nhập thông tin cá nhân để bắt đầu
                </p>
                <button onClick={() => toggleMode(true)} className="btn-outline">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
