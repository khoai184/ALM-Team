import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white px-4 md:px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg md:text-xl">CodeGym Portal</div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          <Link to="/profile" className="hover:text-blue-200 transition">Profile</Link>
          <Link to="/courses" className="hover:text-blue-200 transition">Courses</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-blue-500">
          <div className="flex flex-col space-y-2 mt-4">
            <Link 
              to="/" 
              className="block py-2 hover:text-blue-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/profile" 
              className="block py-2 hover:text-blue-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link 
              to="/courses" 
              className="block py-2 hover:text-blue-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
