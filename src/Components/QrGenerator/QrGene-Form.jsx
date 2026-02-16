import React from 'react';
import { Download } from "lucide-react";
import {
    Link,
    Type,
    Mail,
    Wifi,
    MoreHorizontal,
} from "lucide-react";

function QrGene_Form({
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

    const getPlaceholderText = () => {
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

    const getLabelText = () => {
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
    const tabs = [
        { name: "LINK", icon: <Link size={18} /> },
        { name: "TEXT", icon: <Type size={18} /> },
        { name: "EMAIL", icon: <Mail size={18} /> },
        { name: "WIFI", icon: <Wifi size={18} /> },
        { name: "DATA", icon: <MoreHorizontal size={18} /> },
    ];

    return (
        <>
            {/* Tabs */}
            <div className="flex justify-between sm:justify-between flex-wrap sm:flex-nowrap border-gray-200 border-b mb-6">
                {tabs.map((tab) => (
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
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Email Address (Required)*
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
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    WiFi Network Name (SSID)*
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
                                    WiFi Password (Optional)
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
                            {getLabelText()}
                        </label>
                        <input
                            type={activeTab === "LINK" ? "url" : "text"}
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={getPlaceholderText()}
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
                        className="flex items-center justify-center gap-2 rounded-[13.5px] bg-blue-600 py-4
                                        text-white font-semibold hover:bg-blue-700 active:scale-[0.98] transition
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                            </>
                        ) : (
                            "Generate QR Code"
                        )}
                    </button>

                    <button
                        onClick={handleOneClickDownload}
                        disabled={isDownloading ||
                            (activeTab === "EMAIL" && !emailTo.trim()) ||
                            (activeTab === "WIFI" && !wifiSSID.trim()) ||
                            (activeTab !== "EMAIL" && activeTab !== "WIFI" && !inputValue.trim())
                        }
                        className="flex items-center justify-center rounded-[13.5px] gap-2 bg-green-600 py-4
                                        text-white font-semibold hover:bg-green-700 active:scale-[0.98] transition
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                Generate & Download
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}

export default QrGene_Form;