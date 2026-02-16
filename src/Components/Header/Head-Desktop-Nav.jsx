import React from 'react'
function Head_Desktop_Nav({
    // Data props
    navItems,

    // Handler props
    handleLinkClick,

    // Location props
    location,

    // Link component
    Link
}) {

    return (
        <>
            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center mx-4">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={`relative flex items-center gap-2 px-4 py-2.5 text-sm sm:text-[15px] md:text-[16px] font-medium rounded-xl transition-all duration-200 group/nav ${location.pathname === item.path
                            ? 'text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/90'
                            }`}
                    >

                        <span className="whitespace-nowrap">
                            {item.label}
                        </span>
                        {item.badge && (
                            <span className="absolute -top-2 -right-1 bg-linear-to-r from-pink-500 to-rose-500 text-[10px] sm:text-[10.5px] md:text-[11px] text-white px-2 py-0.5 rounded-full">
                                {item.badge}
                            </span>
                        )}
                        {location.pathname === item.path && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-9 h-0.5 bg-blue-500 rounded-full"></span>
                        )}
                    </Link>
                ))}
            </nav>
        </>
    )
}

export default Head_Desktop_Nav