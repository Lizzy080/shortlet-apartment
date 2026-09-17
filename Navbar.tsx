import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BRAND } from '../data/config';

const aptTypes = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aptOpen, setAptOpen] = useState(false);
  const [availOpen, setAvailOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileAptOpen, setMobileAptOpen] = useState(false);
  const [mobileAvailOpen, setMobileAvailOpen] = useState(false);
  const aptRef = useRef<HTMLDivElement>(null);
  const availRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAptOpen(false);
    setAvailOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aptRef.current && !aptRef.current.contains(e.target as Node)) setAptOpen(false);
      if (availRef.current && !availRef.current.contains(e.target as Node)) setAvailOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#E4EAF2]';

  const textColor = isHome && !scrolled ? 'text-white' : 'text-[#111827]';
  const logoColor = isHome && !scrolled ? 'text-white' : 'text-[#0B2F70]';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#174FC7] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 10L9 3L16 10V16H12V12H6V16H2V10Z" fill="white" />
              </svg>
            </div>
            <span className={`font-bold text-lg tracking-tight ${logoColor}`}>{BRAND.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" active={location.pathname === '/'} light={isHome && !scrolled} />

            {/* Apartments dropdown — hover */}
            <div
              className="relative group"
              onMouseEnter={() => { setAptOpen(true); setAvailOpen(false); }}
              onMouseLeave={() => setAptOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isHome && !scrolled ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-[#374151] hover:text-[#174FC7] hover:bg-[#EEF4FF]'}`}
              >
                Apartments
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform ${aptOpen ? 'rotate-180' : ''}`}>
                  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {aptOpen && (
                <div className="absolute top-full left-0 pt-1 w-44 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-[#E4EAF2] py-1">
                    {aptTypes.map((t) => (
                      <Link
                        key={t}
                        to={`/apartments?type=${encodeURIComponent(t)}`}
                        className="block px-4 py-2.5 text-sm text-[#374151] hover:text-[#174FC7] hover:bg-[#EEF4FF] transition-colors"
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Availability dropdown — hover */}
            <div
              className="relative group"
              onMouseEnter={() => { setAvailOpen(true); setAptOpen(false); }}
              onMouseLeave={() => setAvailOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isHome && !scrolled ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-[#374151] hover:text-[#174FC7] hover:bg-[#EEF4FF]'}`}
              >
                Availability
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform ${availOpen ? 'rotate-180' : ''}`}>
                  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {availOpen && (
                <div className="absolute top-full left-0 pt-1 w-44 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-[#E4EAF2] py-1">
                    {aptTypes.map((t) => (
                      <Link
                        key={t}
                        to={`/availability?type=${encodeURIComponent(t)}`}
                        className="block px-4 py-2.5 text-sm text-[#374151] hover:text-[#174FC7] hover:bg-[#EEF4FF] transition-colors"
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/about" label="About Us" active={location.pathname === '/about'} light={isHome && !scrolled} />
            <NavLink to="/contact" label="Contact" active={location.pathname === '/contact'} light={isHome && !scrolled} />
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate('/apartments')}
              className="px-5 py-2.5 bg-[#174FC7] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors"
            >
              Book Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg ${isHome && !scrolled ? 'text-white' : 'text-[#374151]'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E4EAF2] shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <MobileLink to="/" label="Home" />

            {/* Mobile Apartments accordion */}
            <div>
              <button
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-[#374151] rounded-lg hover:bg-[#F3F4F6]"
                onClick={() => setMobileAptOpen(!mobileAptOpen)}
              >
                Apartments
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform ${mobileAptOpen ? 'rotate-180' : ''}`}>
                  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {mobileAptOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  {aptTypes.map((t) => (
                    <Link
                      key={t}
                      to={`/apartments?type=${encodeURIComponent(t)}`}
                      className="block px-3 py-2 text-sm text-[#667085] hover:text-[#174FC7] rounded-lg hover:bg-[#EEF4FF]"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Availability accordion */}
            <div>
              <button
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-[#374151] rounded-lg hover:bg-[#F3F4F6]"
                onClick={() => setMobileAvailOpen(!mobileAvailOpen)}
              >
                Availability
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform ${mobileAvailOpen ? 'rotate-180' : ''}`}>
                  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {mobileAvailOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  {aptTypes.map((t) => (
                    <Link
                      key={t}
                      to={`/availability?type=${encodeURIComponent(t)}`}
                      className="block px-3 py-2 text-sm text-[#667085] hover:text-[#174FC7] rounded-lg hover:bg-[#EEF4FF]"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <MobileLink to="/about" label="About Us" />
            <MobileLink to="/contact" label="Contact" />

            <div className="pt-2">
              <button
                onClick={() => { navigate('/apartments'); setMenuOpen(false); }}
                className="w-full py-3 bg-[#174FC7] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label, active, light }: { to: string; label: string; active: boolean; light: boolean }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? light ? 'text-white bg-white/15' : 'text-[#174FC7] bg-[#EEF4FF]'
          : light ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-[#374151] hover:text-[#174FC7] hover:bg-[#EEF4FF]'
      }`}
    >
      {label}
    </Link>
  );
}

function MobileLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="block px-3 py-2.5 text-sm font-medium text-[#374151] rounded-lg hover:bg-[#F3F4F6] hover:text-[#111827]"
    >
      {label}
    </Link>
  );
}
