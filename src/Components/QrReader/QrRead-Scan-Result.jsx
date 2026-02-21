import React from 'react'

const ShareIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

const LinkIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const CopyIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const SaveIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

const QrRead_Scan_Result = React.memo(function QrRead_Scan_Result({
    // State props
    qrData,
    copySuccess,
    isURL,
    Save_Btn,

    // Handler props
    handleCopy,
    handleShare,
    handleClear,
}) {
    return (
        <>
            <div>
                {qrData && (
                    <>
                        <h1 className="text-black text-[16px] sm:text-[21px] md:text-[26px] mb-2.5 mt-8 pl-1.5">Scan Result</h1>
                        <div className="bg-white/80 backdrop-blur-sm rounded-[28px] shadow-md border border-blue-100 ">
                            <div className="rounded-2xl p-4.5 sm:p-6 space-y-4 animate-slideUp">
                                <div className="flex items-start gap-2 sm:gap-4">
                                    <div className="bg-green-200 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <CheckIcon />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-2 ml-3 sm:ml-0">DECODED CONTENT</p>
                                        <div className="flex items-center gap-2 bg-white rounded-[13.5px] p-3 border border-green-100">
                                            <span className="flex-1 text-sm text-gray-800 break-all font-mono">
                                                {qrData}
                                            </span>
                                            <button
                                                onClick={handleCopy}
                                                className="relative px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <CopyIcon />
                                                {copySuccess && (
                                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                        Copied!
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    {isURL && (
                                        <a
                                            href={qrData}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-linear-to-r from-blue-600 to-blue-500 text-white py-3 rounded-[13px] hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                                        >
                                            <LinkIcon />
                                            Visit Link
                                        </a>
                                    )}
                                    <button
                                        onClick={handleShare}
                                        className="flex-1 border-2 border-gray-200 bg-white py-3 rounded-[13px] hover:border-blue-200 hover:bg-blue-50 transition-all text-gray-700 flex items-center justify-center gap-2"
                                    >
                                        <ShareIcon />
                                        Share
                                    </button>
                                    <button
                                      onClick={Save_Btn} disabled={!qrData}
                                        className="flex-1 border-2 border-green-200 bg-white py-3 rounded-[13px] hover:border-green-300 hover:bg-green-50 transition-all text-green-600 flex items-center justify-center gap-2"
                                    >
                                        <SaveIcon />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleClear}
                                        className="w-full sm:w-auto px-4 py-3 border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <TrashIcon />
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
});

export default QrRead_Scan_Result
