// src/components/Header.tsx
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react"; // Removed User icon as it's not used directly here
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
      .split(' ')
      .map(n => n[0])
      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserInfo = localStorage.getItem('userInfo');
    if (token && storedUserInfo) {
        setIsLoggedIn(true);
        try {
            setUserInfo(JSON.parse(storedUserInfo));
        } catch (e) {
            console.error("Failed to parse user info from localStorage", e);
            handleLogout(); // Force logout if user info is bad
        }
    } else {
        setIsLoggedIn(false);
        setUserInfo(null);
    }
  }, [location]); // Re-check when route changes

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Main navigation items
  const navItems = [
    { label: "Services", href: "/services" }, // Assuming Services is protected via routing
    { label: "How It Works", href: "/" },
    // Only show Dashboard nav item if logged in
    ...(isLoggedIn ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo links to root/Index page */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-solar rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SolarConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
             {/* Removed conditional rendering for Join as Engineer from main nav */}
          </nav>

          {/* --- Updated Desktop CTA/User Area --- */}
          <div className="hidden md:flex items-center gap-4">
            {/* Always show these two */}
            <Link to="/join">
              <Button variant="ghost">Join as Engineer</Button>
            </Link>
            <Link to="/find-services">
              <Button variant="outline">Find Services</Button>
            </Link>

            {/* Conditionally show Login/Signup OR User Avatar */}
            {!isLoggedIn ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            ) : (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage src="/path/to/avatar.png" alt={userInfo?.fullName} /> */}
                      <AvatarFallback>{getInitials(userInfo?.fullName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userInfo?.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userInfo?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Optional: Add other items like Profile links */}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {/* --- End Updated Buttons/User Area --- */}

          {/* Mobile Menu Button */}
          {/* ... (keep existing button) ... */}
           <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
             {/* --- Updated Mobile Menu --- */}
            <nav className="flex flex-col gap-1">
              {/* Main Nav Items */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

               {/* Always show Join/Find */}
               <Link
                to="/join"
                 onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === "/join"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Join as Engineer
              </Link>
               <Link
                to="/find-services"
                 onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === "/find-services"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Find Services
              </Link>


              {/* Auth Section */}
              <div className="pt-4 mt-4 border-t border-border">
                {!isLoggedIn ? (
                   <div className="space-y-2 px-3">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                     <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button size="sm" className="w-full" asChild>
                     <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                    </Button>
                   </div>
                ) : (
                   <>
                    <div className="px-3 py-2">
                       <p className="text-sm font-medium leading-none">{userInfo?.fullName}</p>
                       <p className="text-xs leading-none text-muted-foreground mt-1">
                         {userInfo?.email}
                       </p>
                    </div>
                    {/* Optional: Add Profile Link here */}
                    <Button variant="ghost" className="w-full justify-start mt-1 px-3" onClick={handleLogout}>
                     Sign Out
                    </Button>
                   </>
                 )}
              </div>
            </nav>
            {/* --- End Updated Mobile Menu --- */}
          </div>
        )}
      </div>
    </header>
  );
};