import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
    }`;

  const links = [
    { to: '/', label: t('home') },
    { to: '/checker', label: t('checker') },
    { to: '/schemes', label: t('schemes') },
    { to: '/profile', label: t('profile') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center shadow-sm ring-1 ring-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4.5 w-4.5 text-white" size={18} />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-slate-900 tracking-tight">SchemeSaathi</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Eligibility Engine</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-slate-600">
                  <Globe size={16} />
                  <span className="text-xs font-medium">{lang === 'en' ? 'EN' : 'हि'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem onClick={() => setLang('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('hi')}>हिन्दी</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              onClick={() => navigate('/checker')}
              className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-white h-9"
            >
              {t('getStarted')}
            </Button>

            <button
              className="md:hidden p-2 text-slate-700"
              onClick={() => setOpen(!open)}
              aria-label="menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-slate-100 pt-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}
            <Button
              size="sm"
              onClick={() => { setOpen(false); navigate('/checker'); }}
              className="bg-slate-900 hover:bg-slate-800 text-white w-full mt-1"
            >
              {t('getStarted')}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;