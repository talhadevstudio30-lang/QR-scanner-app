import React from 'react'

function Head_Mobile_Menu_Btn({
    // State props
    open,

    // Handler props
    setOpen,
    setVisible
}) {

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => {
                    setOpen(!open);
                    setVisible(true);
                }}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
            >
                <div className="relative w-6 h-5">
                    <span className={`absolute top-0 left-0 w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : ''}`}></span>
                    <span className={`absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : ''}`}></span>
                </div>
            </button>
        </>
    )
}

export default Head_Mobile_Menu_Btn