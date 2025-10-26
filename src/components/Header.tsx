// src/components/Header.tsx
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, Menu, X, Pencil, User, Settings, LogOut, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  userType: string;
}

const THEME_PRIMARY = "#4CAFB8";
const THEME_DARK = "#3d9ba3";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserInfo = localStorage.getItem("userInfo");
    if (token && storedUserInfo) {
      setIsLoggedIn(true);
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (e) {
        console.error("Failed to parse user info from localStorage", e);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const navItems = [
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/" },
    ...(isLoggedIn ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .dropdown-content-animated { 
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 50;
        }
        .mobile-menu-animated { 
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 40;
        }
        .backdrop-animated {
          animation: fadeIn 0.3s ease-out;
        }
        .avatar-ring { 
          position: relative; 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .avatar-ring:hover { 
          transform: scale(1.05);
        }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, ${THEME_PRIMARY}, ${THEME_DARK});
          border-radius: 1px;
        }
        .menu-item-mobile {
          transition: all 0.2s ease;
          border-radius: 8px;
        }
        .menu-item-mobile:hover {
          background-color: rgba(76, 175, 184, 0.08);
          transform: translateX(4px);
        }
        .btn-gradient {
          background: linear-gradient(135deg, ${THEME_PRIMARY}, ${THEME_DARK});
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          box-shadow: 0 4px 20px rgba(76, 175, 184, 0.3);
          transform: translateY(-2px);
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#4CAFB8] to-[#3d9ba3] bg-clip-text text-transparent hidden sm:inline">
                SolarConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors relative pb-2 ${
                    location.pathname === item.href
                      ? "text-[#4CAFB8] nav-link-active"
                      : "text-gray-600 hover:text-[#4CAFB8]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop User Area */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/join">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-[#4CAFB8] font-medium transition-colors"
                >
                  Join as Engineer
                </Button>
              </Link>
              <Link to="/find-services">
                <Button 
                  variant="outline" 
                  className="border-[#4CAFB8] text-[#4CAFB8] hover:bg-[#4CAFB8] hover:text-white font-medium transition-all"
                >
                  Find Services
                </Button>
              </Link>

              {!isLoggedIn ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="text-gray-700 hover:text-[#4CAFB8] font-medium"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild 
                    className="btn-gradient text-white font-medium"
                  >
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-11 w-11 rounded-full p-0 hover:bg-[#4CAFB8]/10 avatar-ring"
                    >
                      <Avatar className="h-11 w-11 border-2 border-[#4CAFB8]/20">
                        <AvatarImage src="" alt={userInfo?.fullName} />
                        <AvatarFallback className="bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] text-white font-bold text-sm">
                          {getInitials(userInfo?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-80 dropdown-content-animated shadow-2xl border-gray-100 p-0"
                    align="end"
                    forceMount
                  >
                    <div className="bg-gradient-to-r from-[#4CAFB8]/5 to-[#3d9ba3]/5 p-5">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-14 w-14 border-2 border-[#4CAFB8]/30 shadow-md">
                          <AvatarImage src="" alt={userInfo?.fullName} />
                          <AvatarFallback className="bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] text-white font-bold">
                            {getInitials(userInfo?.fullName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{userInfo?.fullName}</p>
                          <p className="text-xs text-gray-600 truncate">{userInfo?.email}</p>

                          <button
                            className="flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4CAFB8] to-[#3d9ba3] hover:shadow-lg rounded-lg transition-all duration-200 w-fit"
                            onClick={() => navigate("/edit-profile")}
                          >
                            <Pencil className="h-3 w-3" />
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-100" />

                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer px-5 py-3 text-gray-700 hover:text-[#4CAFB8] hover:bg-[#4CAFB8]/5 font-medium transition-all rounded-none"
                    >
                      <User className="mr-3 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="cursor-pointer px-5 py-3 text-gray-700 hover:text-[#4CAFB8] hover:bg-[#4CAFB8]/5 font-medium transition-all rounded-none"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>

                    <div className="border-b border-gray-100" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer px-5 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-all rounded-none"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#4CAFB8] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm backdrop-animated z-30"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white mobile-menu-animated max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-4 py-4 space-y-4">
              {/* User Info Section */}
              {isLoggedIn && (
                <div className="bg-gradient-to-r from-[#4CAFB8]/10 to-[#3d9ba3]/10 rounded-2xl p-4 border border-[#4CAFB8]/20">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-[#4CAFB8]/30 flex-shrink-0">
                      <AvatarImage src="" alt={userInfo?.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] text-white font-bold text-sm">
                        {getInitials(userInfo?.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{userInfo?.fullName}</p>
                      <p className="text-xs text-gray-600 truncate">{userInfo?.email}</p>

                      <button
                        className="flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4CAFB8] to-[#3d9ba3] rounded-lg transition-all duration-200 hover:shadow-md w-fit"
                        onClick={() => {
                          navigate("/edit-profile");
                          handleNavClick();
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleNavClick}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all menu-item-mobile ${
                      location.pathname === item.href
                        ? "text-white bg-gradient-to-r from-[#4CAFB8] to-[#3d9ba3]"
                        : "text-gray-700 hover:text-[#4CAFB8]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {!isLoggedIn ? (
                <div className="space-y-3">
                  <Link to="/join" onClick={handleNavClick}>
                    <Button 
                      variant="ghost" 
                      className="w-full text-gray-700 hover:text-[#4CAFB8] font-medium justify-start"
                    >
                      Join as Engineer
                    </Button>
                  </Link>
                  <Link to="/find-services" onClick={handleNavClick}>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#4CAFB8] text-[#4CAFB8] hover:bg-[#4CAFB8] hover:text-white font-medium"
                    >
                      Find Services
                    </Button>
                  </Link>
                  <Link to="/login" onClick={handleNavClick}>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 text-gray-700 hover:border-[#4CAFB8] hover:text-[#4CAFB8] font-medium"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={handleNavClick}>
                    <Button 
                      className="w-full btn-gradient text-white font-medium"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleNavClick();
                      navigate("/profile");
                    }}
                    className="flex items-center justify-between px-4 py-3 w-full text-gray-700 hover:text-[#4CAFB8] rounded-xl transition-all menu-item-mobile"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">View Profile</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick();
                      navigate("/settings");
                    }}
                    className="flex items-center justify-between px-4 py-3 w-full text-gray-700 hover:text-[#4CAFB8] rounded-xl transition-all menu-item-mobile"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">Settings</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between px-4 py-3 w-full text-red-600 hover:text-red-700 rounded-xl transition-all menu-item-mobile"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Sign Out</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
};