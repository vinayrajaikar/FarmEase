import React from 'react';
import { Menu, Search, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link and useLocation
import { Button } from "./button.jsx";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./sheet.jsx";
import FarmEaseLogo from '../../utils/FarmEaseLogo.png';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile'); // Replace '/profile' with your desired route
};

  const NavItems = () => {
    const navLinks = [
      { to: "/home", label: "Home" },
      { to: "/disease-detection", label: "Disease Detection" },
      { to: "/suppliers", label: "Suppliers" },
      { to: "/news", label: "News" },
    ];

    return (
      <>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block py-2 ${
              location.pathname === link.to
                ? "text-[#00CBA9] font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </>
    );
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-0 w-8 bg-emerald-300 text-base hover:bg-transparent focus:ring-0 lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <nav className="flex flex-col space-y-1 pt-4">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="hidden lg:flex lg:gap-6">
            <NavItems />
          </div>
          
          <div className="flex flex-1 justify-center">
            <img src={FarmEaseLogo} alt="FarmEase" className="h-10 w-auto sm:h-16" />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Location..."
                className="w-[160px] rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00CBA9] sm:w-[200px] bg-transparent"
              />
            </div>
            <Button size="icon" variant="ghost" className="h-9 w-9 bg-emerald-300" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
              <span className="sr-only">User account</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
