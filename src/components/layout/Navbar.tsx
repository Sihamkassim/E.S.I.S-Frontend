import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className={`w-full py-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
    <Link to="/" className="flex items-center">
  <img
    src={theme === "dark" ? "/logoDark.png" : "/ESIS-logo.png"}
    alt="E.S.I.S Logo"
    className="h-20 mr-2"
  />
  <span
    className={`font-bold text-xl ${
      theme === "dark" ? "text-white" : "text-gray-900"
    }`}
  >
    E.S.I.S
  </span>
</Link>

          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-primary'} transition duration-200`}>
              Home
            </Link>
            <Link to="/tech-updates" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-primary'} transition duration-200`}>
              Tech Updates
            </Link>
            <Link to="/community" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-primary'} transition duration-200`}>
              Community
            </Link>
            <Link to="/projects" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-primary'} transition duration-200`}>
              Projects
            </Link>
            <Link to="/membership" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-primary'} transition duration-200`}>
              Membership
            </Link>
            <Link to="/about" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-primary'} transition duration-200`}>
              About
            </Link>
            <Link to="/webinars" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-primary'} transition duration-200`}>
              Webinars
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <Link to="/login" className="px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-md transition duration-200">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-white text-primary border border-primary hover:bg-gray-100 rounded-md transition duration-200">
              Register
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-4 py-4 border-t md:hidden">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/tech-updates" 
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                Tech Updates
              </Link>
              <Link 
                to="/community" 
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/projects" 
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/membership" 
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                Membership
              </Link>
              <Link 
                to="/about" 
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/webinars" 
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                Webinars
              </Link>
              <div className="flex items-center px-4 justify-between">
                <button 
                  onClick={toggleTheme} 
                  className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-white text-primary border border-primary hover:bg-gray-100 rounded-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
