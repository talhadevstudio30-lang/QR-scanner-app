import React from 'react'
import {
    Palette,
    Download,
    Copy,
    Share2,
} from "lucide-react";
function QrGene_Qrpreview({
    // State props
    qrUrl,
    size,
    customization,
    isDownloading,

    // Handler props
    downloadQRCode,
    copyQRCodeToClipboard,
    shareQRCode
}) {

    return (
        <>

            <div className='mt-6 lg:mt-0 lg:border-none  py-5.5 px-1.5 lg:px-4 lg:py-4 rounded-3xl border-2 bg-white shadow-sm border-slate-200 borde p-6 flex flex-col'>
                <div className='hidden lg:block'>
                    <h2 className="text-[21px] mt-1 font-semibold text-center">QR Preview</h2>
                    <p className="text-[15px] text-slate-500 text-center mb-6">
                        Real-time generated code with customization
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    {qrUrl ? (
                        <div className="relative">
                            <img
                                src={qrUrl}
                                alt="Generated QR Code"
                                style={{
                                    width: `${Math.min(parseInt(size), 400)}px`,
                                    height: `${Math.min(parseInt(size), 400)}px`,
                                    backgroundColor: customization.isTransparent ? 'transparent' : customization.backgroundColor,
                                    padding: `${customization.margin}px`
                                }}
                                className="object-contain rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="w-68 h-68 bg-slate-100 rounded-2xl flex flex-col items-center justify-center">
                            <Palette size={48} className="text-slate-400 mb-2" />
                            <span className="text-slate-400 mb-2">QR Preview</span>
                            <p className="text-xs text-slate-500 text-center px-4">
                                Enter your data and click "Generate QR Code"
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 space-y-3 px-2.5">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={downloadQRCode}
                            disabled={!qrUrl || isDownloading}
                            className="flex items-center justify-center gap-2 rounded-[13.5px] bg-blue-600 py-3.5 
                                    text-white font-semibold hover:bg-blue-700 transition
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Download size={18} />
                                    Download
                                </>
                            )}
                        </button>

                        <button
                            onClick={copyQRCodeToClipboard}
                            disabled={!qrUrl}
                            className="flex items-center justify-center rounded-[13.5px] gap-2 border py-3.5
                                    text-slate-700 hover:bg-slate-100 transition
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Copy size={18} />
                            Copy
                        </button>
                    </div>

                    <button
                        onClick={shareQRCode}
                        disabled={!qrUrl}
                        className="w-full flex rounded-[13.5px] items-center justify-center gap-2 border py-3.5 
                                text-slate-700 hover:bg-slate-100 transition
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Share2 size={18} />
                        Share Code
                    </button>
                </div>
                <div className='hidden lg:block'>
                    <div className="mt-4 text-xs text-slate-600 bg-blue-50 p-3 rounded-[13px] grid items-start gap-2">
                        <p>
                            This QR code is <span className="font-medium text-slate-700">static</span> — once created, it works forever ✨
                            No expiration, no stress. Just scan and go, anytime, anywhere.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QrGene_Qrpreview