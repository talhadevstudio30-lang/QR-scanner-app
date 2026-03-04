import React from 'react'

function Scan_Cont() {
    return (
        <div>
            <div className="bg-white/80 rounded-[28px] shadow-md border border-blue-100 p-3 md:p-5 space-y-4">
                {/* Mode Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        className="flex-1 flex items-center justify-center gap-3 rounded-[16.5px] py-7 bg-[#ECEFF4]"
                    >
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-3 rounded-[16.5px] py-7                        bg-[#ECEFF4]
                            "
                    >
                    </button>
                </div>
                <div
                    className="border-3 border-dashed border-gray-200 rounded-[26px] p-12 py-20"
                >
                    <input
                        className='grid justify-center items-center'
                    />
                    <>
                        <div className="grid justify-center item-center">
                           <div className='bg-[#ECEFF4] h-20 w-20'>

                           </div>
                        </div>
                        <div className="mt-4 grid justify-center items-center">
                        <div className='bg-[#ECEFF4] w-45 h-5'>

                        </div>
                        </div>
                        <div className="mt-2 grid justify-center items-center">
                        <div className='bg-[#ECEFF4] w-43 h-5'>

                        </div>
                        </div>
                        <div className="mt-4 grid justify-center items-center">
                            <div className='bg-[#ECEFF4] w-33 h-10'>

                        </div>
                        </div>
                    </>
                </div>
            </div>
        </div>

    )
}

export default Scan_Cont