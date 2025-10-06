import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import UserService from "../modules/auth/services/keycloakService";
import codegymLogo from "../assets/codegymlogo.png";

export default function HomeNavbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    username?: string;
    email?: string;
    name?: string;
  } | null>(null);

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
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={codegymLogo} 
                alt="CodeGym Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm khóa học, bài học..."
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side - User Avatar */}
          <div className="flex items-center">
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
        </div>
      </div>
    </nav>
  );
}
