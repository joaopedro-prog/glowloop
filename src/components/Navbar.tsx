
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 container-padding">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-glow-pink to-aqua-suave text-transparent bg-clip-text">
            GlowLoop
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-indigo-dark focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="#features" className="text-indigo-dark hover:text-coral transition-colors">
            Features
          </Link>
          <Link to="#problem" className="text-indigo-dark hover:text-coral transition-colors">
            Why GlowLoop
          </Link>
          <Link to="#pricing" className="text-indigo-dark hover:text-coral transition-colors">
            Pricing
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" className="border-glow-pink text-glow-pink hover:bg-glow-pink/10">
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-1">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-aqua-suave text-indigo-dark">JP</AvatarFallback>
                </Avatar>
              </div>
              <Button onClick={handleLogout} variant="ghost">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-glow-pink text-glow-pink hover:bg-glow-pink/10">
                  Login
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-glow-pink to-aqua-suave hover:opacity-90 transition-opacity">
                Get Early Access
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`${
          isMenuOpen ? 'max-h-60' : 'max-h-0'
        } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <div className="container-padding pb-4 space-y-4">
          <Link to="#features" className="block text-indigo-dark hover:text-coral">
            Features
          </Link>
          <Link to="#problem" className="block text-indigo-dark hover:text-coral">
            Why GlowLoop
          </Link>
          <Link to="#pricing" className="block text-indigo-dark hover:text-coral">
            Pricing
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block">
                <Button variant="outline" className="border-glow-pink text-glow-pink hover:bg-glow-pink/10 w-full">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" className="w-full">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="block">
                <Button variant="outline" className="border-glow-pink text-glow-pink hover:bg-glow-pink/10 w-full">
                  Login
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-glow-pink to-aqua-suave hover:opacity-90 transition-opacity w-full">
                Get Early Access
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
