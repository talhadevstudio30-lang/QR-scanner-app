import React from 'react'

function Head_Right_Side_Actions({
    // Handler props
    handleLinkClick,

    // Link component
    Link
}) {
    return (
        <>
            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
                <Link to="/About">
                    <button
                        onClick={handleLinkClick}
                        className="px-3 py-2 focus:text-blue-500 text-sm sm:text-[15.5px] md:text-[16.5px] font-medium text-gray-700 rounded-xl hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        About
                    </button>
                </Link>

                <button
                    onClick={handleLinkClick}
                    className="px-3.5 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl text-sm sm:text-[15.5px] md:text-[16.5px] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
                >
                    <span className="flex items-center gap-1">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                            <path fill="none" stroke="currentColor" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            <path fill="none" stroke="currentColor" stroke-width="2" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg></span>
                        Contact
                    </span>
                </button>
            </div>
        </>
    )
}

export default Head_Right_Side_Actions