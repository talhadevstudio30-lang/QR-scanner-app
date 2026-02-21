import React, { useCallback, useMemo } from 'react';
import {
    Clock,
} from "lucide-react";

const QrGene_Stored_History = React.memo(function QrGene_Stored_History({ history, setHistory, deleteHistoryItem, History_Info_Button, selectedHistoryItem }) {

    const formatTime = useCallback((timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString();
    }, []);
    const clearHistory = useCallback(() => {
        if (history.length === 0) return;

        if (window.confirm("Are you sure you want to clear all history?")) {
            setHistory([]);
            localStorage.removeItem("qrHistory");
        }
    }, [history.length, setHistory]);

    const displayHistory = useMemo(() => (
        history.length === 0 ? [{ id: "empty", empty: true }] : history
    ), [history]);

    return (
        <div>
            <div className="mb-6 mt-9">
                {/* Header */}
                <div className="flex items-center justify-between px-3.5 sm:px-12 py-3 mb-4">
                    <h3 className="text-lg sm:text-[19px] md:text-[22px] font-semibold text-slate-900">
                        Generated History({history.length})
                    </h3>

                    {history.length > 0 && (
                        <>
                            <button
                                onClick={clearHistory}
                                className="text-14.5px sm:text-[15px] font-medium text-blue-600 hover:underline"
                            >
                                Clear All
                            </button>
                        </>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-14 sm:gap-6 px-9 py-4">
                    {displayHistory.map((item) => {
                        if (item.empty) {
                            return (
                                <div className="col-span-full group">
                                    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-blue-50/20 to-indigo-50/30 p-8 text-center border border-blue-100/60 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-200">

                                        {/* Animated background pattern */}
                                        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,transparent,black)] opacity-40" />

                                        {/* Floating gradient orbs */}
                                        <div className="absolute top-0 -left-4 w-32 h-32 bg-linear-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl animate-pulse" />
                                        <div className="absolute bottom-0 -right-4 w-40 h-40 bg-linear-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl animate-pulse delay-1000" />

                                        {/* Main content */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            {/* Icon container with animation */}
                                            <div className="mb-6 relative">
                                                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-ping" />
                                                <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg shadow-blue-500/20 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                    <Clock size={36} className="text-white" strokeWidth={1.8} />
                                                </div>
                                            </div>

                                            {/* Title with gradient */}
                                            <h3 className="mb-3 text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                                Your History is Empty
                                            </h3>

                                            {/* Descriptive text */}
                                            <p className="max-w-md text-base text-slate-600 mb-4">
                                                  Click "Save & Generate" to add QR codes to your history
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
                            );
                        }

                        return (
                            <div
                                key={item.id}
                                className={`group cursor-pointer  border rounded-[26px] bg-white p-3 transition-all
                                                hover:-translate-y-1 hover:shadow-lg
                                                ${selectedHistoryItem?.id === item.id
                                        ? "border-blue-300 ring-1 ring-blue-200"
                                        : "border-slate-200"
                                    }`}
                            >
                                {/* Preview */}
                                <div
                                    className="flex items-center justify-center aspect-square rounded-[22px] p-4"
                                    style={{
                                        backgroundColor: item.customization?.isTransparent
                                            ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)'
                                            : item.customization?.backgroundColor || '#FFFFFF'
                                    }}
                                >
                                    <img
                                        src={item.qrUrl}
                                        alt="QR Code Preview"
                                        className="h-[94%] w-[94%] sm:h-full sm:w-full object-contain"
                                    />
                                </div>

                                {/* Info */}
                                <div className="mt-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[17.5px] sm:text-[18px] md:text-[18.5px] ml-0.5 font-medium text-slate-900">
                                            {item.type} QR
                                        </p>
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => History_Info_Button(item)}
                                                className="opacity-0 group-hover:opacity-100 p-1 sm:p-1.5 text-slate-500 hover:text-blue-600 
               transition-all duration-200 ease-in-out transform hover:scale-110 
               hover:bg-blue-50 rounded-lg active:scale-95 active:bg-blue-100 
               focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
               touch-manipulation"
                                                aria-label="View history details"
                                                title="View Details"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={(e) => deleteHistoryItem(item.id, e)}
                                                className="p-1 sm:p-1.5 opacity-0 group-hover:opacity-100  text-slate-500 hover:text-red-600 
               transition-all duration-200 ease-in-out transform hover:scale-110 
               hover:bg-red-50 active:bg-red-100
               focus:outline-none focus:ring-2 rounded-lg active:scale-95 focus:ring-red-300 focus:ring-opacity-50
               touch-manipulation"
                                                aria-label="Delete history item"
                                                title="Delete"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5 "
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[14.5px] sm:text-[15px] -mt-1 text-slate-500 ml-1 mb-0.5">
                                        <span className='text-green-600 font-bold'>·</span> {formatTime(item.timestamp)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
});

export default QrGene_Stored_History;
