import React from 'react';
import { Link } from "react-router-dom";

function Head_Logo({handleLinkClick }) {
  return (
    <>
     {/* Logo */}
      <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2 group shrink-0"
              onClick={handleLinkClick}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-linear-to-br from-blue-600 to-blue-500 rounded-[10px] flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-100 group-hover:shadow-blue-200 group-hover:scale-105 transition-all duration-300">
                <img src="QR-icon.png" alt="" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                  QRGen
                </span>
                <span className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">
                  Professional QR Solutions
                </span>
              </div>
            </Link>
    </>
  )
}

export default Head_Logo
