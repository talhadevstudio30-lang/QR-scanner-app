import React from 'react'

const CloseIcon = () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const QrRead_History = React.memo(function QrRead_History({
    // State props
    scanHistory,
    
    clearHistory,
    removeFromHistory,
    Reader_History_Item,

    // Helper function props
    getIconForType,
    formatTimestamp,

}) {
    return (
        <>
            <div className="backdrop-blur-sm rounded-[29px] p-1.5 sm:p-5">
                <div className="flex items-center flex-wrap justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">Saved <span className='text-[#256afff1]'>QR</span> Codes({scanHistory.length})</h2>
                    </div>
                    <div className="flex gap-1">
                        {scanHistory.length > 0 && (
                            <>
                                <button
                                    onClick={clearHistory}
                                    className="text-sm text-red-500 hover:text-red-600 px-2 py-1.5 rounded-[9px] hover:bg-red-50 transition-all"
                                >
                                    Clear All
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                    {scanHistory.map((scan) => (
                        <div
                            key={scan.id}
                            onClick={() => Reader_History_Item(scan)}
                            className="group bg-white border border-gray-200 sm:rounded-2xl rounded-[17px] p-2.5 sm:p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all hover:border-blue-200"
                        >
                            <div className="w-10 h-10 bg-linear-to from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                {getIconForType(scan.type)}
                            </div>
                            <div className="flex-1 min-w-0"> {/* min-w-0 allows flex child to shrink below content size */}
                                <div className="min-w-0">
                                    <p className="text-sm sm:text-xs font-medium text-gray-900 break-all sm:wrap-break-words whitespace-normal line-clamp-3 sm:line-clamp-2">
                                        {scan.data}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1.5 flex-wrap">
                                    <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${scan.type === "URL" ? "bg-blue-100 text-blue-600" :
                                        scan.type === "WiFi" ? "bg-purple-100 text-purple-600" :
                                            scan.type === "Email" ? "bg-green-100 text-green-600" :
                                                // Fixed duplicate condition above
                                                "bg-gray-100 text-gray-600"
                                        }`}>
                                        {scan.type}
                                    </span>
                                    <span className="truncate">• {formatTimestamp(scan.timestamp)}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => removeFromHistory(scan.id)}
                                className="opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-[7px] shrink-0"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    ))}
                </div>

                {scanHistory.length === 0 && (
                    <div
                        key="empty-history"
                        className="col-span-full w-full group"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-blue-50/20 to-indigo-50/30 p-8 text-center border border-blue-100/60 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-200 ">

                            {/* Animated background pattern */}
                            <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,transparent,black)] opacity-40" />

                            {/* Floating gradient orbs */}
                            <div className="absolute top-0 -left-4 w-32 h-32 bg-linear-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute bottom-0 -right-4 w-40 h-40 bg-linear-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl animate-pulse delay-1000" />

                            {/* Main content */}
                            <div className="relative z-10 flex flex-col items-center">
                               
                                {/* Title with gradient */}
                                <h3 className="mb-3 text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    Your Gallery is Empty
                                </h3>

                                {/* Descriptive text */}
                                <p className="max-w-md text-base text-slate-600 mb-4">
                                    Click "Save" to add QR codes to your gallery
                                </p>

                                {/* Feature highlights */}
                                <div className="flex flex-wrap gap-3 justify-center mb-6">
                                    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-slate-600">Quick access</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-slate-600">Easy-save</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-slate-600">Unlimited storage</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
});

export default QrRead_History;
