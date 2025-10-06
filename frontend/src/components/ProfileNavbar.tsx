import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import UserService from "../modules/auth/services/keycloakService";
import codegymLogo from "../assets/codegymlogo.png";

export default function ProfileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    username?: string;
    email?: string;
    name?: string;
  } | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = UserService.isLoggedIn();
      
      if (loggedIn) {
        // Lấy thông tin user từ localStorage hoặc Keycloak
        const userData = localStorage.getItem('user_info');
        if (userData) {
          setUserInfo(JSON.parse(userData));
        } else {
          // Fallback: tạo user info từ Keycloak token
          const tokenParsed = UserService.getKeyCloack()?.tokenParsed;
          if (tokenParsed) {
            setUserInfo({
              username: tokenParsed.preferred_username || 'User',
              email: tokenParsed.email || '',
              name: tokenParsed.name || tokenParsed.preferred_username || 'User'
            });
          }
        }
      } else {
        // Set default user info when not logged in
        setUserInfo({
          username: 'Guest',
          email: '',
          name: 'Guest User'
        });
      }
    };

    checkAuthStatus();
    
    // Listen for auth changes
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu')) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    UserService.doLogout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <div className="flex items-center abo">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={codegymLogo} 
                alt="CodeGym Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Center Navigation Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/profile" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActiveRoute('/profile') 
                  ? 'text-white bg-white/20 border-b-4 border-white' 
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Bài viết
            </Link>

            <Link 
              to="/courses" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActiveRoute('/courses') 
                  ? 'text-white bg-white/20 border-b-4 border-white' 
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Khóa học
            </Link>

            <Link 
              to="/schedule" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActiveRoute('/schedule') 
                  ? 'text-white bg-white/20 border-b-4 border-white' 
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Lịch học
            </Link>

            <Link 
              to="/scores" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActiveRoute('/scores') 
                  ? 'text-white bg-white/20 border-b-4 border-white' 
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Điểm số
            </Link>

            <Link 
              to="/tuition" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActiveRoute('/tuition') 
                  ? 'text-white bg-white/20 border-b-4 border-white' 
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Học phí
            </Link>
          </div>

          {/* Right side - Notifications and User Avatar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notification Bell */}
            <button className="text-white hover:text-blue-200 transition-all duration-200 p-2 rounded-full hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a2.5 2.5 0 01-2.5-2.5V7a2.5 2.5 0 012.5-2.5h15a2.5 2.5 0 012.5 2.5v10a2.5 2.5 0 01-2.5 2.5h-15z" />
              </svg>
            </button>

            {/* User Avatar with Dropdown */}
            <div className="relative user-menu">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-white hover:text-blue-200 transition-all duration-200 p-1 rounded-full hover:bg-white/10"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center relative shadow-lg">
                  <span className="text-sm font-medium text-white">
                    {userInfo?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              </button>

              {/* User Dropdown Card */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 user-menu">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{userInfo?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{userInfo?.email || ''}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Hồ sơ cá nhân
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // Navigate to settings
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Cài đặt
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-500 rounded-lg mt-2">
              <Link
                to="/profile"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActiveRoute('/profile') ? 'bg-white/20 text-white border-l-4 border-white' : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Bài viết
              </Link>
              <Link
                to="/courses"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActiveRoute('/courses') ? 'bg-white/20 text-white border-l-4 border-white' : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Khóa học
              </Link>
              <Link
                to="/schedule"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActiveRoute('/schedule') ? 'bg-white/20 text-white border-l-4 border-white' : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Lịch học
              </Link>
              <Link
                to="/scores"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActiveRoute('/scores') ? 'bg-white/20 text-white border-l-4 border-white' : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Điểm số
              </Link>
              <Link
                to="/tuition"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActiveRoute('/tuition') ? 'bg-white/20 text-white border-l-4 border-white' : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Học phí
              </Link>
              
              {/* Mobile Auth */}
              <div className="border-t border-blue-400 pt-4 mt-4">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center relative shadow-lg">
                      <span className="text-lg font-medium text-white">
                        {userInfo?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-sm text-blue-100">Đã đăng nhập với</p>
                      <p className="text-white font-medium">{userInfo?.username || 'User'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Hồ sơ cá nhân
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        // Navigate to settings
                      }}
                      className="flex items-center w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Cài đặt
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 rounded-lg text-red-300 hover:text-white hover:bg-red-500/20 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
