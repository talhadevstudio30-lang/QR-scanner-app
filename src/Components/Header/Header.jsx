import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Head_Mobile_Menu from "./Head-Mobile-Menu";
import Head_Logo from "./Head-Logo";
import Head_Right_Side_Actions from "./Head-Right-Side-Actions";
import Head_Desktop_Nav from "./Head-Desktop-Nav";
import Head_Mobile_Menu_Btn from "./Head-Mobile-Menu-Btn";

const Generate_Icon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="56" height="56" rx="16" fill="url(#genBg)" />
    <path d="M28 16L30 22L36 24L30 26L28 32L26 26L20 24L26 22L28 16Z" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="38" cy="18" r="1.5" fill="#3B82F6" />
    <circle cx="18" cy="36" r="1.5" fill="#3B82F6" />
    <defs>
      <linearGradient id="genBg" x1="0" y1="0" x2="66" y2="66">
        <stop stopColor="#EAF3FF" />
        <stop offset="1" stopColor="#DCEAFF" />
      </linearGradient>
    </defs>
  </svg>
);

const Scanner_Icon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="56" height="56" rx="16" fill="url(#scanBg)" />
    <rect x="16" y="20" width="24" height="16" rx="4" stroke="#6366F1" strokeWidth="2" />
    <circle cx="28" cy="28" r="4" stroke="#6366F1" strokeWidth="2" />
    <path d="M22 20L24 16H32L34 20" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="scanBg" x1="0" y1="0" x2="56" y2="56">
        <stop stopColor="#EEF2FF" />
        <stop offset="1" stopColor="#E0E7FF" />
      </linearGradient>
    </defs>
  </svg>
);

const API_Docs_Icon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="56" height="56" rx="16" fill="url(#apiBg)" />
    <rect x="18" y="16" width="20" height="24" rx="4" stroke="#10B981" strokeWidth="2" />
    <rect x="25" y="14" width="6" height="4" rx="2" stroke="#10B981" strokeWidth="2" fill="white" />
    <path d="M24 26L22 28L24 30" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 26L34 28L32 30" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M29 25L27 31" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="apiBg" x1="0" y1="0" x2="56" y2="56">
        <stop stopColor="#E8FFF4" />
        <stop offset="1" stopColor="#D1FAE5" />
      </linearGradient>
    </defs>
  </svg>
);

const NAV_ITEMS = [
  {
    label: "Generator",
    icon: <Generate_Icon />,
    path: "/generator",
    theme: {
      activeBg: "bg-blue-50",
      activeText: "text-blue-600",
      activeIconBg: "bg-blue-100",
      hoverIconBg: "group-hover/mobile:bg-blue-100"
    }
  },
  {
    label: "Scanner",
    icon: <Scanner_Icon />,
    path: "/scanner",
    theme: {
      activeBg: "bg-indigo-50",
      activeText: "text-indigo-600",
      activeIconBg: "bg-indigo-100",
      hoverIconBg: "group-hover/mobile:bg-indigo-100"
    }
  },
  {
    label: "API Docs",
    icon: <API_Docs_Icon />,
    path: "/api-docs",
    badge: "New",
    theme: {
      activeBg: "bg-emerald-50",
      activeText: "text-emerald-600",
      activeIconBg: "bg-emerald-100",
      hoverIconBg: "group-hover/mobile:bg-emerald-100"
    }
  }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef("up");
  const tickingRef = useRef(false);
  const scrollThreshold = 10;
  const hideThreshold = 50;

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY.current) {
          if (scrollDirectionRef.current !== "down") {
            scrollDirectionRef.current = "down";
          }

          if (currentScrollY - lastScrollY.current > scrollThreshold && currentScrollY > hideThreshold) {
            setVisible(false);
          }
        } else {
          if (scrollDirectionRef.current !== "up") {
            scrollDirectionRef.current = "up";
          }

          if (lastScrollY.current - currentScrollY > scrollThreshold) {
            setVisible(true);
          }

          if (currentScrollY < hideThreshold) {
            setVisible(true);
          }
        }

        setScrolled(currentScrollY > 5);
        setScrollProgress(Math.min(100, Math.max(0, (currentScrollY / 300) * 100)));

        lastScrollY.current = currentScrollY;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
    };
  }, [open]);

  const handleLinkClick = useCallback(() => {
    setVisible(true);
    setOpen(false);
  }, []);

  return (
    <>
      {/* Header with LinkedIn scroll behavior */}
      <header className={`fixed top-0 py-1.5 left-0 right-0 w-full bg-[#ffffff94] border-b border-gray-200 backdrop-blur-md transition-all duration-300 z-50
        ${!visible ? '-translate-y-full' : 'translate-y-0'}
        ${scrolled ? 'shadow-lg border-gray-300/50' : 'shadow-sm border-gray-100'}
      `}>
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <div>
              <Head_Logo handleLinkClick={handleLinkClick} />
            </div>

            {/* Desktop Navigation */}
            <div>
              <Head_Desktop_Nav
                // Data props
                navItems={NAV_ITEMS}

                // Handler props
                handleLinkClick={handleLinkClick}

                // Location props
                location={location}
              />
            </div>

            {/* Right Side Actions */}
            <div>
              <Head_Right_Side_Actions
                // Handler props
                handleLinkClick={handleLinkClick}
              />
            </div>

            {/* Mobile Menu Button */}
            <Head_Mobile_Menu_Btn
              // State props
              open={open}

              // Handler props
              setOpen={setOpen}
              setVisible={setVisible}
            />
          </div>
        </div>

        {/* Progress indicator */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-blue-400 opacity-50">
            <div
              className="h-full bg-linear-to-r from-blue-600 to-blue-500 transition-all duration-100"
              style={{
                width: `${scrollProgress}%`
              }}
            />
          </div>
        )}
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-14 sm:h-16" />

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-xs z-60 lg:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Menu */}
      <div>
        <Head_Mobile_Menu
          // State props
          open={open}

          // Handler props
          setOpen={setOpen}
          handleLinkClick={handleLinkClick}

          // Data props
          navItems={NAV_ITEMS}

          // Location props
          location={location}
        />
      </div>
    </>
  );
}
