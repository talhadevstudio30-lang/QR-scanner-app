import React from 'react';
import {
    Link,
    Type,
    Mail,
    Wifi,
    MoreHorizontal,
} from "lucide-react";

const TABS = [
    { name: "LINK", icon: <Link size={18} /> },
    { name: "TEXT", icon: <Type size={18} /> },
    { name: "EMAIL", icon: <Mail size={18} /> },
    { name: "WIFI", icon: <Wifi size={18} /> },
    { name: "DATA", icon: <MoreHorizontal size={18} /> },
];

const getPlaceholderText = (activeTab) => {
    switch (activeTab) {
        case "LINK":
            return "https://yourwebsite.com/page";
        case "TEXT":
            return "Enter your text here...";
        case "EMAIL":
            return "";
        case "WIFI":
            return "Enter WiFi Network Name (SSID)";
        case "DATA":
            return "Enter data for QR code...";
        default:
            return "Enter your data...";
    }
};

const getLabelText = (activeTab) => {
    switch (activeTab) {
        case "LINK":
            return "Website URL";
        case "TEXT":
            return "Text Content";
        case "EMAIL":
            return "Email Configuration";
        case "WIFI":
            return "WiFi Configuration";
        case "DATA":
            return "Custom Data";
        default:
            return "Input Data";
    }
};

const QrGene_Form = React.memo(function QrGene_Form({
    // State props
    activeTab,
    inputValue,
    emailTo,
    emailSubject,
    emailBody,
    wifiSSID,
    passwordValue,
    encryptionType,
    size,
    isGenerating,
    isDownloading,
    // Handler props
    handleInputChange,
    handleEmailToChange,
    handleEmailSubjectChange,
    handleEmailBodyChange,
    handleWifiInputChange,
    handlePasswordChange,
    handleEncryptionTypeChange,
    handleSizeChange,
    generateQRCode,
    handleOneClickDownload,
    setActiveTab,
    setInputValue,
}) {

    return (
        <>
            {/* Tabs */}
            <div className="flex justify-between sm:justify-between flex-wrap sm:flex-nowrap border-gray-200 border-b mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => {
                            setActiveTab(tab.name);
                            setInputValue("");
                        }}
                        className={`flex flex-col items-center gap-1 px-5 py-2 text-sm font-medium transition
                                            ${activeTab === tab.name
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-slate-400 hover:text-slate-600"
                            }
                                        `}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </div>
            {/* Form */}
            <div className="space-y-5">
                {/* Conditional rendering based on active tab */}
                {activeTab === "EMAIL" ? (
                    // EMAIL TAB - Detailed email form
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={emailTo}
                                    onChange={handleEmailToChange}
                                    placeholder="recipient@example.com"
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={handleEmailSubjectChange}
                                    placeholder="Email subject"
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">
                                Message Body
                            </label>
                            <textarea
                                value={emailBody}
                                onChange={handleEmailBodyChange}
                                placeholder="Type your message here..."
                                rows="3"
                                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </>
                ) : activeTab === "WIFI" ? (
                    // WIFI TAB - WiFi form
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    WiFi Network Name
                                </label>
                                <input
                                    type="text"
                                    value={wifiSSID}
                                    onChange={handleWifiInputChange}
                                    placeholder="Enter WiFi Network Name (SSID)"
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    WiFi Password
                                </label>
                                <input
                                    type="text"
                                    value={passwordValue}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter WiFi password (leave empty for open network)"
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">
                                WiFi Encryption Type
                            </label>
                            <select
                                value={encryptionType}
                                onChange={handleEncryptionTypeChange}
                                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="WPA">WPA/WPA2 (Most Secure)</option>
                                <option value="WEP">WEP (Less Secure)</option>
                                <option value="nopass">Open Network (No Password)</option>
                            </select>
                        </div>
                    </>
                ) : (
                    // OTHER TABS - Simple input
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            {getLabelText(activeTab)}
                        </label>
                        <input
                            type={activeTab === "LINK" ? "url" : "text"}
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={getPlaceholderText(activeTab)}
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}

                {/* Size Selection Only */}
                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Size (Pixels)
                    </label>
                    <select
                        value={size}
                        onChange={handleSizeChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="150">150 × 150 px</option>
                        <option value="250">250 × 250 px</option>
                        <option value="270">270 × 270 px</option>
                        <option value="300">300 × 300 px</option>
                        <option value="500">500 × 500 px</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 px-0.5">
                    <button
                        onClick={generateQRCode}
                        disabled={isGenerating ||
                            (activeTab === "EMAIL" && !emailTo.trim()) ||
                            (activeTab === "WIFI" && !wifiSSID.trim()) ||
                            (activeTab !== "EMAIL" && activeTab !== "WIFI" && !inputValue.trim())
                        }
                        className="flex items-center justify-center gap-2 rounded-[14.5px] bg-blue-600 py-4
                        text-white font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg
                        border border-blue-400"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Generate QR Code
                            </>
                        )}

                    </button>
                    <button
                        onClick={handleOneClickDownload}
                        disabled={isDownloading ||
                            (activeTab === "EMAIL" && !emailTo.trim()) ||
                            (activeTab === "WIFI" && !wifiSSID.trim()) ||
                            (activeTab !== "EMAIL" && activeTab !== "WIFI" && !inputValue.trim())
                        }
                        className="flex items-center justify-center rounded-[14.5px] gap-2 bg-white py-4
                        text-blue-600 font-semibold hover:bg-blue-50 active:scale-[0.98] transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg
                        border-2 border-blue-600"
                    >
                        {isDownloading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-blue-600">Downloading...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
                                </svg>
                                Generate & Save
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
});

export default QrGene_Form;
