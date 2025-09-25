import { useState } from "react";
import "../../../App.css";
import "../../../global.css";
import CGlogo from "../../../assets/codegymlogo.png";
import BG from "../../../assets/codegym.png";

export default function AuthPage() {
  const backgroundUrl = BG;
  const codegymLogoUrl = CGlogo;
  const [isSignup, setIsSignup] = useState(false);
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login");
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayContent, setOverlayContent] = useState<"login" | "signup">("login");

  const toggleMode = (signup: boolean) => {
    setIsAnimating(true);
    setTimeout(() => setOverlayContent(signup ? "signup" : "login"), 100);
    setIsSignup(signup);
    setTimeout(() => setActiveForm(signup ? "signup" : "login"), 800);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div
        className="relative w-full max-w-[1000px] h-[600px] rounded-2xl shadow-2xl overflow-hidden"
        style={{}}
      >
      {/* LOGIN FORM */}
      <div
        className={`absolute top-0 left-0 w-full md:w-1/2 h-full flex items-center justify-center
          transition-all duration-700 ease-in-out
          ${isSignup ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100 z-10"}
        `}
      >
        {activeForm === "login" && (
          <form className="w-4/5 max-w-sm space-y-4 bg-white/95 p-4 md:p-8 rounded-xl shadow-lg">
            <img src={codegymLogoUrl} alt="CodeGym Logo" className="h-10 mb-6" />

            <input type="email" placeholder="Email address" className="input-style" />
            <input type="password" placeholder="Password" className="input-style" />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-indigo-600" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-indigo-600 hover:underline">Forgot password?</a>
            </div>

            <button className="btn-primary w-full">Login</button>

            <p
              className="text-indigo-600 text-sm underline cursor-pointer"
              onClick={() => toggleMode(true)}
            >
              Don’t have an account?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4">
              <button type="button" className="btn-social bg-red-500 w-full sm:w-auto">Google</button>
              <button type="button" className="btn-social bg-blue-600 w-full sm:w-auto">Facebook</button>
            </div>
          </form>
        )}
      </div>

      {/* SIGNUP FORM */}
      <div
        className={`absolute top-0 right-0 w-full md:w-1/2 h-full flex items-center justify-center
          transition-all duration-700 ease-in-out
          ${isSignup ? "translate-x-0 opacity-100 z-10" : "translate-x-full opacity-0"}
        `}
      >
        {activeForm === "signup" && (
          <form className="w-4/5 max-w-sm space-y-4 bg-white/95 p-4 md:p-8 rounded-xl shadow-lg">
            <img src={codegymLogoUrl} alt="CodeGym Logo" className="h-10 mb-6" />

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
        className={`absolute top-0 left-0 w-full md:w-1/2 h-full z-30
          bg-indigo-700/90 text-white
          flex flex-col items-center justify-center
          transition-transform duration-700 ease-in-out
          ${isSignup ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Logo TIM */}
        <img src="/path/to/tim.png" alt="TIM Logo" className="h-8 mb-6" />

        <div
          className={`transition-opacity duration-300 px-4 md:px-6 text-center ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          {overlayContent === "signup" ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Welcome Back!</h1>
              <p className="mb-6 text-sm">Để tiếp tục, vui lòng đăng nhập</p>
              <button onClick={() => toggleMode(false)} className="btn-outline">
                Sign In
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Hello, welcome!</h1>
              <p className="mb-6 text-sm">Nhập thông tin cá nhân để bắt đầu</p>
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
