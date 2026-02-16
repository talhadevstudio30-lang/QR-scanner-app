import React, { useState } from 'react';
import {
    Palette,
} from "lucide-react";

function QrGene_Customize({ customization, resetCustomization, handleThemeChange }) {

    // Margin options
    const marginOptions = [
        { value: "0", label: "None" },
        { value: "1", label: "Small" },
        { value: "4", label: "Medium" },
        { value: "8", label: "Large" },
    ];

    const [customize_appearance_length, setcustomize_appearance_length] = useState(false);

    // Theme presets with foreground and background colors
    const themePresets = [
        { name: "Classic Black", foreground: "#000000", background: "#FFFFFF" },
        { name: "Ocean Blue", foreground: "#2563eb", background: "#f8fafc" },
        { name: "Royal Purple", foreground: "#7c3aed", background: "#faf5ff" },
        { name: "Forest Green", foreground: "#059669", background: "#f0fdf4" },
        { name: "Sunset Red", foreground: "#dc2626", background: "#fff7ed" },
        { name: "Minimal Gray", foreground: "#334155", background: "#f1f5f9" },
        { name: "Cyber Pink", foreground: "#db2777", background: "#fdf2f8" },
        { name: "Deep Ocean", foreground: "#0f766e", background: "#ecfdf5" },
        { name: "Warm Amber", foreground: "#b45309", background: "#fffbeb" },
        { name: "Berry", foreground: "#9d174d", background: "#fdf2f8" },
    ];

    // Helper function to get current theme name
    const getCurrentThemeName = () => {
        const currentTheme = themePresets.find(
            theme => theme.foreground === customization.foregroundColor &&
                theme.background === customization.backgroundColor
        );
        return currentTheme ? currentTheme.name : "";
    };
    const [ShowMore_ShowLess_Status, setShowMore_ShowLess_Status] = useState("More");

    const handle_ShowMore_ShowLess = () => {
        setcustomize_appearance_length(prev => {
            const next = !prev;
            setShowMore_ShowLess_Status(next ? "Less" : "More");
            return next;
        });
    };

    return (
        <>
            <div>
                <div className="lg:mt-5 border-2 lg:py-5 lg:px-5 rounded-3xl bg-white shadow-sm px-3.5 py-3.5 border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Palette size={24} className="text-blue-500" />
                            Customize Appearance
                        </h3>
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={resetCustomization}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handle_ShowMore_ShowLess}
                                className="text-xs bg-blue-600 text-white rounded-[10px] 
                               transition-all duration-200 ease-in-out
                               px-2.5 py-1.5 border-2 border-transparent
                               hover:bg-white hover:text-blue-600 hover:border-blue-500
                               hover:shadow-md hover:scale-105
                               focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-70
                               focus:border-blue-400 focus:shadow-lg
                               active:scale-95 active:bg-blue-50 active:shadow-sm
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {ShowMore_ShowLess_Status}
                            </button>
                        </div>
                    </div>

                    {/* Theme Selection */}
                    <div className="space-y-5">
                        {/* Theme Presets */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Theme Colors
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {themePresets.slice(0, customize_appearance_length ? 12 : 5).map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => handleThemeChange(theme.foreground, theme.background)}
                                        className={`relative rounded-[13.5px] h-12.5 transition-all overflow-hidden
                                                    ${customization.foregroundColor === theme.foreground &&
                                                customization.backgroundColor === theme.background
                                                ? "ring-2 ring-offset-2 scale-105 ring-offset-blue-100 ring-blue-400"
                                                : "hover:scale-105 border-2 border-slate-200"
                                            }`}
                                        title={theme.name}
                                    >
                                        <div
                                            className="absolute inset-0"
                                            style={{ backgroundColor: theme.background }}
                                        />
                                        <div
                                            className="absolute inset-0 flex items-center justify-center"
                                            style={{
                                                color: theme.foreground,
                                                fontSize: '20px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <div className='h-3.5 w-3.5 rounded-full' style={{
                                                backgroundColor: theme.foreground,
                                            }}>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Current Theme Display */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[14.5px] sm:text-[15px] md:text-[15.5px] font-medium text-slate-700">
                                    Current Theme
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-slate-600`}>
                                    {getCurrentThemeName()}
                                </span>
                            </div>
                        </div>

                        {customize_appearance_length && (
                            <>
                                {/* Margin Settings */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                                        Margin Size
                                    </label>
                                    <div className="flex gap-2">
                                        {marginOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleMarginChange(option.value)}
                                                className={`flex-1 rounded-xl border py-3 text-sm font-medium transition
                                                        ${customization.margin === option.value
                                                        ? "bg-blue-50 border-blue-500 text-blue-600 border-2"
                                                        : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Preview */}
                                <div className="pt-4 border-t border-slate-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700">
                                            Theme Preview
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            {customization.foregroundColor} / {customization.backgroundColor}
                                        </div>
                                    </div>
                                    <div className="h-12 rounded-[14px] border border-slate-200 flex overflow-hidden">
                                        <div
                                            className="flex-1 flex items-center justify-center"
                                            style={{ backgroundColor: customization.backgroundColor }}
                                        >
                                            <div className="text-sm sm:text-[13.5px] md:text-[15px] text-slate-600">
                                                Background
                                            </div>
                                        </div>
                                        <div
                                            className="flex-1 flex items-center justify-center text-white text-sm sm:text-[13.5px] md:text-[15px]"
                                            style={{ backgroundColor: customization.foregroundColor }}
                                        >
                                            QR Color
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default QrGene_Customize;