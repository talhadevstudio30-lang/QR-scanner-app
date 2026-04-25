import React from 'react'

function Mission_Loader() {
    return (
        <section className="px-4 pb-16">
            <div className="max-w-4xl lg:max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">

                <div className="animate-pulse flex flex-col items-center space-y-4">

                    {/* ICON */}
                    <div className="h-7 w-7 rounded-full bg-blue-200" />

                    {/* TITLE */}
                    <div className="h-6 w-40 bg-gray-200 rounded-md" />

                    {/* TEXT */}
                    <div className="space-y-2 w-full max-w-xl">
                        <div className="h-3 w-full bg-gray-200 rounded-md" />
                        <div className="h-3 w-5/6 bg-gray-200 rounded-md mx-auto" />
                    </div>

                </div>

            </div>
        </section>
    )
}

export default Mission_Loader
