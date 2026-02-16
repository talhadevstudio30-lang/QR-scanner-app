import React from 'react'

function QrRead_Scan_Cont({
    // State props
    mode,
    preview,
    loading,
    error,

    // Ref props
    fileInputRef,
    videoRef,
    canvasRef,

    // Handler props
    setMode,
    stopCamera,
    setQrData,
    setPreview,
    setError,
    startCamera,
    handleDrop,
    handleDragOver,
    handleFile,
}) {
    // Make sure this is in your QrReader.jsx file (it should be there)
    const CloseIcon = () => (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
    // SVG Icons (keeping all your icons the same)
    const UploadIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    );

    const CameraIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const DropIcon = () => (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    );

    const SpinnerIcon = () => (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
    return (
        <>
            <div className=" bg-white/80 backdrop-blur-sm rounded-[28px] shadow-md border border-blue-100 p-3 md:p-5 space-y-4">
                {/* Mode Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => {
                            stopCamera();
                            setMode("upload");
                            setQrData(null);
                            setPreview(null);
                            setError("");
                        }}
                        className={`flex-1 flex items-center justify-center gap-3 rounded-[16.5px] py-4 transition-all ${mode === "upload"
                            ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200"
                            : "border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700"
                            }`}
                    >
                        <UploadIcon />
                        <span className="font-medium">Upload Image</span>
                    </button>
                    <button
                        onClick={() => {
                            setMode("camera");
                            setPreview(null);
                            setQrData(null);
                            setError("");
                        }}
                        className={`flex-1 flex items-center justify-center gap-3 rounded-[16.5px] py-4 transition-all ${mode === "camera"
                            ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200"
                            : "border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700"
                            }`}
                    >
                        <CameraIcon />
                        <span className="font-medium">Use Camera</span>
                    </button>
                </div>

                {/* Camera View */}
                {mode === "camera" && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="rounded-3xl overflow-hidden bg-black relative aspect-video">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                            />
                        </div>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={startCamera}
                                className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <CameraIcon />
                                Start Camera
                            </button>
                            <button
                                onClick={stopCamera}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Stop
                            </button>
                        </div>
                    </div>
                )}

                {/* Upload Area */}
                {mode === "upload" && (
                    <div
                        onClick={() => fileInputRef.current.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-3 border-dashed border-blue-200 rounded-[26px] p-12 py-20 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                        />

                        {preview ? (
                            <div className="relative inline-block">
                                <img src={preview} className="max-w-xs rounded-xl shadow-lg" alt="Preview" />
                            </div>
                        ) : (
                            <>
                                <div className="text-blue-500 group-hover:scale-110 grid justify-center item-center transition-transform">
                                    <DropIcon />
                                </div>
                                <p className="mt-4 text-xl font-medium text-gray-700">
                                    Drop your QR code here
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Supports PNG, JPG, GIF • Max 5MB
                                </p>
                                <button className="mt-4 bg-linear-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all">
                                    Browse Files
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl">
                            <SpinnerIcon />
                            <span>Scanning QR code...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
                        {error}
                    </div>
                )}
            </div>
        </>
    )
}

export default QrRead_Scan_Cont