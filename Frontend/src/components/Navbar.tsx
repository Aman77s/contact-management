import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useNavigate , useLocation} from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth'; // 👈 adjust path if needed
import toast from 'react-hot-toast';

interface NavbarProps {
  logo?: string;
  brandName?: string;
  loginUrl?: string;
  signupUrl?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  logo,
  brandName = "ContactPro",
  loginUrl = "/login",
  signupUrl = "/register"
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    navigate("/");
    toast.success('Logout Successfully')
  };

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Services', href: '#', hasDropdown: true },
    { name: 'Contact', href: '#' },
  ];

  const dropdownItems = [
    { name: 'Web Development', href: '#' },
    { name: 'Mobile Apps', href: '#' },
    { name: 'UI/UX Design', href: '#' },
    { name: 'Consulting', href: '#' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {logo ? (
                <img className="h-8 w-auto" src={logo} alt={brandName} />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {brandName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              {brandName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            {dropdownItems.map((dropItem) => (
                              <a
                                key={dropItem.name}
                                href={dropItem.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                              >
                                {dropItem.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={loginUrl}
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to={signupUrl}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-base font-medium mx-3 block text-center hover:bg-red-600 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to={loginUrl}
                    className="w-full text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to={signupUrl}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 mx-3 block text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
