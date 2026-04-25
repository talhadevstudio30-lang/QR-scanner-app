import React from 'react'

function Docs_Create_Shadow() {
    return (
            <div className="bg-white rounded-[28px] shadow-sm p-6 sm:p-8">

                {/* wrapper shimmer */}
                <div className="animate-pulse space-y-6">

                    {/* TITLE */}
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-14 rounded-md bg-blue-100" />
                        <div className="h-7 w-48 rounded-md bg-gray-200" />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-200 rounded-md" />
                        <div className="h-3 w-5/6 bg-gray-200 rounded-md" />
                    </div>

                    {/* ENDPOINT */}
                    <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 flex justify-between items-center">
                        <div className="h-4 w-3/4 bg-blue-200 rounded-md" />
                        <div className="h-5 w-5 bg-blue-200 rounded-md" />
                    </div>

                    {/* REQUEST PARAMETERS TITLE */}
                    <div className="h-5 w-40 bg-gray-200 rounded-md" />

                    {/* TABLE */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="divide-y">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="grid grid-cols-4 gap-4 p-3">
                                    <div className="h-4 bg-gray-200 rounded-md" />
                                    <div className="h-4 bg-gray-200 rounded-md" />
                                    <div className="h-4 bg-gray-200 rounded-md" />
                                    <div className="h-4 bg-gray-200 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EXAMPLE REQUEST HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="h-5 w-40 bg-gray-200 rounded-md" />

                        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-7 w-16 bg-white rounded-md border border-gray-200" />
                            ))}
                        </div>
                    </div>

                    {/* CODE BLOCK */}
                    <div className="bg-blue-50 rounded-[14px] p-4 border border-blue-100 flex justify-between items-start">
                        <div className="space-y-2 w-full">
                            <div className="h-3 w-full bg-blue-200 rounded-md" />
                            <div className="h-3 w-5/6 bg-blue-200 rounded-md" />
                            <div className="h-3 w-4/6 bg-blue-200 rounded-md" />
                            <div className="h-3 w-3/6 bg-blue-200 rounded-md" />
                        </div>
                        <div className="ml-3 h-5 w-5 bg-blue-200 rounded-md" />
                    </div>

                </div>
            </div>
    )
}

export default Docs_Create_Shadow;
