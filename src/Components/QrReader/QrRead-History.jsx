import React from 'react'

const HistoryIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

function QrRead_History({
    // State props
    scanHistory,
    showHistory,

    // Handler props
    setShowHistory,
    clearHistory,
    removeFromHistory,

    // Helper function props
    getIconForType,
    formatTimestamp,

}) {
    return (
        <>
            <div className="backdrop-blur-sm rounded-[29px] p-5">
                <div className="flex items-center flex-wrap justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center">
                            <HistoryIcon />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Scan History({scanHistory.length})</h2>
                    </div>
                    <div className="flex gap-2">
                        {scanHistory.length > 0 && (
                            <>
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="text-sm text-blue-600 rounded-[9px] hover:text-blue-700 px-3 py-1.5 hover:bg-blue-50 transition-all"
                                >
                                    {showHistory ? "Show Less" : "View All"}
                                </button>
                                <button
                                    onClick={clearHistory}
                                    className="text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-[9px] hover:bg-red-50 transition-all"
                                >
                                    Clear All
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                    {(showHistory ? scanHistory : scanHistory.slice(0, 6)).map((scan) => (
                        <div
                            key={scan.id}
                            className="group bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all hover:border-blue-200"
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
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-3 flex justify-center">
                            <HistoryIcon />
                        </div>
                        <p className="text-gray-500">No recent scans yet</p>
                        <p className="text-sm text-gray-400 mt-1">Scan a QR code to see it here</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default QrRead_History;
