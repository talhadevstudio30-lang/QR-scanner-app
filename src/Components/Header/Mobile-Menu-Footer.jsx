import React from 'react'

function Header_Mobile_Menu_Footer() {
  return (
    <>
     {/* Mobile Menu Footer */}
          <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
            <div className="text-center">
              <button className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mb-3">
                Get Started Free
              </button>
              <p className="text-xs text-gray-500">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
    </>
  )
}

export default Header_Mobile_Menu_Footer