import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Head_Mobile_Menu from "./Head-Mobile-Menu";
import Head_Logo from "./Head-Logo";
import Head_Right_Side_Actions from "./Head-Right-Side-Actions";
import Head_Desktop_Nav from "./Head-Desktop-Nav";
import Head_Mobile_Menu_Btn from "./Head-Mobile-Menu-Btn";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  const lastScrollY = useRef(0);
  const scrollThreshold = 10;
  const hideThreshold = 50;

  // LinkedIn-like scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        // Scrolling DOWN
        if (scrollDirection !== "down") {
          setScrollDirection("down");
        }

        // Hide header when scrolling down past threshold
        if (currentScrollY - lastScrollY.current > scrollThreshold && currentScrollY > hideThreshold) {
          setVisible(false);
        }
      } else {
        // Scrolling UP
        if (scrollDirection !== "up") {
          setScrollDirection("up");
        }

        // Show header when scrolling up past threshold
        if (lastScrollY.current - currentScrollY > scrollThreshold) {
          setVisible(true);
        }

        // Always show header when near top
        if (currentScrollY < hideThreshold) {
          setVisible(true);
        }
      }

      // Set scrolled state for shadow effect
      setScrolled(currentScrollY > 5);
      setScrollProgress(Math.min(100, Math.max(0, (currentScrollY / 300) * 100)));

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDirection]);

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

  const navItems = [
    { label: "Generator", icon: "✨", path: "/generator" },
    { label: "Scanner", icon: "📷", path: "/scanner" },
    { label: "API Docs", icon: "📚", path: "/api-docs", badge: "New" },
  ];

  const handleLinkClick = () => {
    setVisible(true);
    setOpen(false);
  };

  return (
    <>
      {/* Header with LinkedIn scroll behavior */}
      <header className={`fixed top-0 py-1.5 left-0 right-0 w-full bg-[#ffffff84] border-b border-gray-200 backdrop-blur-md transition-all duration-300 z-50
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
                navItems={navItems}

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
          navItems={navItems}

          // Location props
          location={location}
        />
      </div>
    </>
  );
}
