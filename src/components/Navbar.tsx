import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'IELTS TEST', path: '/ielts-test' },
    { label: 'NEXT TEST PREPARATION', path: '/next-prep' },
    { label: 'RESULT', path: '/results' },
    { label: 'ROUTIN', path: '/routine' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b-4 border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-blue-900 border-2 border-b-4 border-blue-900 px-3 py-1 rounded-xl shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 transition-all">
                IELTS REMI
              </span>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:space-x-4 h-full items-center py-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                  location.pathname === link.path
                    ? "bg-blue-600 text-white border-b-4 border-blue-800 shadow-md translate-y-0"
                    : "bg-white text-slate-600 border-2 border-slate-200 border-b-4 hover:-translate-y-1 hover:shadow-md hover:border-blue-100 hover:text-blue-600 active:border-b-2 active:translate-y-[2px]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="ml-4 p-2.5 bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-white border-2 border-slate-200 border-b-4 rounded-xl transition-all hover:-translate-y-1 active:border-b-2 active:translate-y-[2px] shadow-sm"
              title="Admin Panel"
            >
              <ShieldAlert size={20} />
            </Link>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 mx-2 mb-2 rounded-xl text-base font-bold transition-all",
                  location.pathname === link.path
                    ? "bg-blue-600 text-white border-b-4 border-blue-800 shadow-md"
                    : "bg-white text-slate-600 border-2 border-slate-200 border-b-4 active:border-b-2 active:translate-y-[2px]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 mx-2 mb-2 bg-slate-100 border-2 border-slate-200 border-b-4 rounded-xl text-base font-bold text-slate-600 active:border-b-2 active:translate-y-[2px]"
            >
              <ShieldAlert size={18} /> Admin Access
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
