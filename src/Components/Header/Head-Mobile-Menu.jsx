import React from 'react';
import { Link } from "react-router-dom";
import Header_Mobile_Menu_Footer from "./Mobile-Menu-Footer";

function Head_Mobile_Menu({
    // State props
    open,

    // Handler props
    setOpen,handleLinkClick,

    // Data props
    navItems,

    // Location props
    location
}) {
    // ... component code ...

    return (
        <>
            {/* Mobile Menu */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl z-60 lg:hidden transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-linear-to-br from-blue-600 to-blue-500 rounded-[10px] flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-100 group-hover:shadow-blue-200 group-hover:scale-105 transition-all duration-300">
                                <img src="QR-icon.png" alt="" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-lg">Menu</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 md:h-7.5 md:w-7.5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-1">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Main Navigation
                            </div>

                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={handleLinkClick}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group/mobile ${location.pathname === item.path
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-transform ${location.pathname === item.path
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 group-hover/mobile:bg-blue-100'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium flex items-center gap-2 text-base">
                                            {item.label}
                                            {item.badge && (
                                                <span className="bg-linear-to-r from-pink-500 to-rose-500 text-xs text-white px-2 py-0.5 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-0.5">
                                            {item.label === "Scanner" ? "Scan QR codes instantly" :
                                                item.label === "Generator" ? "Create custom QR codes" :
                                                    "API documentation & integration"}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Additional Links */}
                        <div className="p-4 border-t border-gray-100">
                            <div className="space-y-2">
                                <Link
                                    to="/about"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        ℹ️
                                    </div>
                                    <span className="font-medium">About Us</span>
                                </Link>
                                <Link
                                    to="/contact"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        📧
                                    </div>
                                    <span className="font-medium">Contact Us</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Footer */}
                    <div>
                        <Header_Mobile_Menu_Footer />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Head_Mobile_Menu
