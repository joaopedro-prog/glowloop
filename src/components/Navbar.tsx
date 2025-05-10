
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 container-padding">
        <a href="#" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-glow-pink to-aqua-suave text-transparent bg-clip-text">
            GlowLoop
          </span>
        </a>

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
          <a href="#features" className="text-indigo-dark hover:text-coral transition-colors">
            Features
          </a>
          <a href="#problem" className="text-indigo-dark hover:text-coral transition-colors">
            Why GlowLoop
          </a>
          <a href="#pricing" className="text-indigo-dark hover:text-coral transition-colors">
            Pricing
          </a>
          <Button className="btn-primary">Get Early Access</Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`${
          isMenuOpen ? 'max-h-60' : 'max-h-0'
        } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <div className="container-padding pb-4 space-y-4">
          <a href="#features" className="block text-indigo-dark hover:text-coral">
            Features
          </a>
          <a href="#problem" className="block text-indigo-dark hover:text-coral">
            Why GlowLoop
          </a>
          <a href="#pricing" className="block text-indigo-dark hover:text-coral">
            Pricing
          </a>
          <Button className="btn-primary w-full">
            Get Early Access
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
