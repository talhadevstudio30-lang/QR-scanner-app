import React, { useContext, useCallback, useMemo } from 'react';
import { counterContext as CounterContext } from '../Context/Context';
import {
    Clock,
} from "lucide-react";

const QrGene_Stored_History = React.memo(function QrGene_Stored_History() {
    const value = useContext(CounterContext);
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
        if (value.history.length === 0) return;

        if (window.confirm("Are you sure you want to clear all history?")) {
            value.setHistory([]);
            localStorage.removeItem("qrHistory");
        }
    }, [value]);

    const displayHistory = useMemo(() => (
        value.history.length === 0 ? [{ id: "empty", empty: true }] : value.history
    ), [value.history]);

    return (
        <div>
            <div className="mb-6 mt-9">
                {/* Header */}
                <div className="flex items-center justify-between px-3.5 sm:px-12 py-3 mb-4">
                    <h3 className="text-lg sm:text-[19px] md:text-[22px] font-semibold text-slate-900">
                        Saved <span className='text-[#2f71fff1]'>QR</span> Codes (<span className='text-[#2f71fff1]'>{value.history.length}</span>)
                    </h3>

                    {value.history.length > 0 && (
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
                <div className="flex justify-center lg:justify-start items-center flex-wrap sm:gap-6 sm:px-9 sm:py-4">
                    {displayHistory.map((item) => {
                        if (item.empty) {
                            return (
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
                                onClick={() => value.History_Info_Button(item)}
                                className={`group cursor-pointer my-2 w-full sm:w-56 md:w-65 lg:w-75 
  rounded-2xl bg-white p-4 flex flex-col justify-between
  transition-all duration-200
  hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]
  ${value.selectedHistoryItem?.id === item.id
                                        ? "border-2 border-blue-400 ring-2 ring-blue-200/50 shadow-md"
                                        : "border border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                {/* TOP SECTION */}
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">

                                        {/* TEXT */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                                                {item.type} QR
                                            </p>

                                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-2 wrap-break-word">
                                                {(item.details?.wifiSSID || item.details?.text || item.details?.whatsappNumber || item.details?.emailTo || item.details?.url)?.slice(0, 30)}
                                                {((item.details?.wifiSSID || item.details?.text)?.length || 0) > 30 && "..."}
                                            </p>
                                        </div>

                                        {/* DELETE BUTTON */}
                                        <button
                                            onClick={(e) => value.deleteHistoryItem(item.id, e)}
                                            className="shrink-0 p-2 
        text-slate-400 hover:text-red-500 transition-all duration-200 
        hover:bg-red-50 active:bg-red-100 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 sm:w-5 sm:h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 
            0116.138 21H7.862a2 2 0 
            01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 
            1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* BOTTOM SECTION */}
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-green-500 text-lg leading-none">•</span>
                                    <p className="text-xs sm:text-sm text-slate-500 truncate">
                                        {formatTime(item.timestamp)}
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
