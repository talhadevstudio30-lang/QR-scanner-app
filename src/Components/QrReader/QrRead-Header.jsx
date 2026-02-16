import React from 'react'

function QrRead_Header() {
    return (
        <>
            <div className="relative">
                <div className="absolute"></div>
                <div className="relative py-4">
                    <h1 className="text-[31px] md:text-[38px] font-bold text-gray-900 tracking-tight">
                        QR Code Reader
                    </h1>
                    <p className="text-gray-500 mt-1 text-lg">
                        Upload an image or use your camera to decode any QR code instantly.
                    </p>
                </div>
            </div>
        </>
    )
}

export default QrRead_Header