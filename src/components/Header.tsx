// src/components/Header.tsx
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, Menu, X, Pencil, User, Settings, LogOut } from "lucide-react";
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

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-content-animated { animation: slideDown 0.2s ease-out; }
        .avatar-ring { position: relative; transition: all 0.3s ease; }
        .avatar-ring::before {
          content: ''; position: absolute; inset: -2px; border-radius: 50%; padding: 2px;
          background: linear-gradient(135deg, #4CAFB8, #3d9ba3);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.3s ease;
        }
        .avatar-ring:hover::before { opacity: 1; }
        .edit-button-header { transition: all 0.2s ease; }
        .edit-button-header:hover { transform: translateY(-1px); }
        .menu-item-header { transition: all 0.2s ease; }
        .menu-item-header:hover { transform: translateX(4px); }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SolarConnect</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-[#4CAFB8] ${
                    location.pathname === item.href ? "text-[#4CAFB8]" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA/User Area */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/join">
                <Button variant="ghost" className="hover:text-[#4CAFB8]">Join as Engineer</Button>
              </Link>
              <Link to="/find-services">
                <Button variant="outline" className="border-[#4CAFB8] text-[#4CAFB8] hover:bg-[#4CAFB8] hover:text-white">
                  Find Services
                </Button>
              </Link>

              {!isLoggedIn ? (
                <>
                  <Button variant="outline" size="sm" asChild className="border-gray-300 hover:border-[#4CAFB8] hover:text-[#4CAFB8]">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-[#4CAFB8] hover:bg-[#3d9ba3] text-white">
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent avatar-ring"
                    >
                      <Avatar className="h-10 w-10 border-2 border-gray-200">
                        <AvatarImage src="" alt={userInfo?.fullName} />
                        <AvatarFallback className="bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] text-white font-semibold">
                          {getInitials(userInfo?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-72 dropdown-content-animated shadow-xl border-[#4CAFB8]/20"
                    align="end"
                    forceMount
                  >
                    {/* User Info Section */}
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-[#4CAFB8]/30">
                          <AvatarImage src="" alt={userInfo?.fullName} />
                          <AvatarFallback className="bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] text-white font-semibold">
                            {getInitials(userInfo?.fullName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{userInfo?.fullName}</p>
                          <p className="text-xs text-gray-500 leading-tight">{userInfo?.email}</p>

                          <button
                            className="edit-button-header flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs font-medium text-[#4CAFB8] hover:text-white bg-[#4CAFB8]/10 hover:bg-[#4CAFB8] rounded-md transition-all duration-200"
                            onClick={() => {
                              setIsMenuOpen(false);
                              navigate("/edit-profile");
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-gray-200" />

                    {/* Menu Items */}
                    <div className="py-1">
                      <DropdownMenuItem
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="menu-item-header cursor-pointer px-4 py-2.5 focus:bg-[#4CAFB8]/10 focus:text-[#4CAFB8]"
                      >
                        <User className="mr-3 h-4 w-4" />
                        <span className="font-medium">View Profile</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/settings");
                        }}
                        className="menu-item-header cursor-pointer px-4 py-2.5 focus:bg-[#4CAFB8]/10 focus:text-[#4CAFB8]"
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        <span className="font-medium">Settings</span>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-gray-200" />

                    {/* Logout */}
                    <div className="py-1">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="menu-item-header cursor-pointer px-4 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="font-medium">Sign out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
