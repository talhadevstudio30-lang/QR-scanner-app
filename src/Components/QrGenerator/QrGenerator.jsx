import { useState, useEffect } from "react";
import QrGene_History from "./QrGene-history";
import QrGene_Customize from "./QrGene-Customize";
import QrGene_Qrpreview from "./QrGene-Qrpreview";
import QrGene_Form from "./QrGene-Form";
import QrGene_Header from "./QrGene-Header";

export default function QrGenerator() {
    const [activeTab, setActiveTab] = useState("TEXT");
    const [qrUrl, setQrUrl] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [size, setSize] = useState("270");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const [wifiSSID, setWifiSSID] = useState("");
    const [encryptionType, setEncryptionType] = useState("WPA");

    // Email fields
    const [emailTo, setEmailTo] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");

    // History state
    const [history, setHistory] = useState([]);
    const [selectedHistoryItem] = useState(null);

    // Customization state
    const [customization, setCustomization] = useState({
        foregroundColor: "#000000",
        backgroundColor: "#FFFFFF",
        margin: "1",
        hasMargin: true,
        isTransparent: false,
        eyeStyle: "square",
        hasLogo: false,
        logoUrl: "",
        logoSize: "20",
    });

    // Load history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("qrHistory");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (error) {
                console.error("Failed to parse history from localStorage:", error);
            }
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem("qrHistory", JSON.stringify(history));
        }
    }, [history]);

    // Update fields when tab changes
    useEffect(() => {
        if (activeTab !== "WIFI") {
            setPasswordValue("");
            setWifiSSID("");
        }

        if (activeTab !== "EMAIL") {
            setEmailTo("");
            setEmailSubject("");
            setEmailBody("");
            setInputValue("");
        }
    }, [activeTab]);

    // Function to generate WiFi QR code data format
    const generateWifiQRData = () => {
        if (!wifiSSID.trim()) {
            return "";
        }

        const passwordPart = passwordValue ? `P:${passwordValue};` : "";
        return `WIFI:S:${wifiSSID};T:${encryptionType};${passwordPart};`;
    };

    // Function to generate Email QR code data format
    const generateEmailQRData = () => {
        if (!emailTo.trim()) {
            return "";
        }

        let emailData = `mailto:${emailTo.trim()}`;
        const params = [];

        if (emailSubject.trim()) {
            params.push(`subject=${encodeURIComponent(emailSubject.trim())}`);
        }

        if (emailBody.trim()) {
            params.push(`body=${encodeURIComponent(emailBody.trim())}`);
        }

        if (params.length > 0) {
            emailData += `?${params.join('&')}`;
        }

        return emailData;
    };

    // Function to build QR code URL with customization - ALWAYS PNG
    const buildQrUrl = (dataToEncode) => {
        const sizeParam = `${size}x${size}`;
        let url = `https://api.qrserver.com/v1/create-qr-code/?size=${sizeParam}&data=${encodeURIComponent(dataToEncode)}&format=png`;

        // Add customization parameters
        url += `&color=${customization.foregroundColor.replace('#', '')}`;

        if (customization.isTransparent) {
            url += `&bgcolor=transparent`;
        } else {
            url += `&bgcolor=${customization.backgroundColor.replace('#', '')}`;
        }

        url += `&margin=${customization.hasMargin ? customization.margin : '0'}`;
        url += `&qzone=1`;

        return url;
    };

    // Function to add QR code to history
    const addToHistory = (dataToEncode, generatedUrl) => {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: activeTab,
            data: dataToEncode,
            size: size,
            qrUrl: generatedUrl,
            customization: { ...customization },
            details: getHistoryDetails()
        };

        const newHistory = [historyItem, ...history.slice(0, 49)];
        setHistory(newHistory);
    };

    // Function to get detailed information for history item
    const getHistoryDetails = () => {
        switch (activeTab) {
            case "EMAIL":
                return {
                    emailTo,
                    emailSubject,
                    emailBody,
                };
            case "WIFI":
                return {
                    wifiSSID,
                    passwordValue: passwordValue,
                    hasPassword: !!passwordValue,
                    encryptionType
                };
            case "LINK":
                return {
                    url: inputValue,
                    preview: inputValue.length > 50 ? inputValue.substring(0, 50) + "..." : inputValue
                };
            case "TEXT":
                return {
                    text: inputValue,
                    preview: inputValue.length > 50 ? inputValue.substring(0, 50) + "..." : inputValue
                };
            case "MORE":
                return {
                    data: inputValue,
                    preview: inputValue.length > 50 ? inputValue.substring(0, 50) + "..." : inputValue
                };
            default:
                return {};
        }
    };

    const generateQRCode = () => {
        let dataToEncode = inputValue;

        if (activeTab === "WIFI") {
            const wifiData = generateWifiQRData();
            if (!wifiData) {
                alert("Please enter WiFi Network Name (SSID)");
                return;
            }
            dataToEncode = wifiData;
        }
        else if (activeTab === "EMAIL") {
            const emailData = generateEmailQRData();
            if (!emailData) {
                alert("Please enter at least an email address");
                return;
            }
            dataToEncode = emailData;
        }
        else if (!inputValue.trim()) {
            alert("Please enter some data to generate QR code");
            return;
        }

        setIsGenerating(true);

        setTimeout(() => {
            const url = buildQrUrl(dataToEncode);
            setQrUrl(url);
            addToHistory(dataToEncode, url);
            setIsGenerating(false);
        }, 500);
    };

    // Enhanced download functionality
    const downloadQRCode = async () => {
        if (!qrUrl) {
            alert("Please generate a QR code first");
            return;
        }

        setIsDownloading(true);

        try {
            const filename = `qr-code-${Date.now()}.png`;
            const response = await fetch(qrUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch QR code: ${response.status}`);
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');

            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            }, 100);

            showNotification(`QR Code downloaded as ${filename}`);

        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download QR code. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    // One-click download with auto-generation
    const handleOneClickDownload = async () => {
        let dataToEncode = inputValue;

        if (activeTab === "WIFI") {
            const wifiData = generateWifiQRData();
            if (!wifiData) {
                alert("Please enter WiFi Network Name (SSID)");
                return;
            }
            dataToEncode = wifiData;
        }
        else if (activeTab === "EMAIL") {
            const emailData = generateEmailQRData();
            if (!emailData) {
                alert("Please enter at least an email address");
                return;
            }
            dataToEncode = emailData;
        }
        else if (!inputValue.trim()) {
            alert("Please enter some data to generate QR code");
            return;
        }

        setIsDownloading(true);

        try {
            const url = buildQrUrl(dataToEncode);
            setQrUrl(url);
            addToHistory(dataToEncode, url);

            await new Promise(resolve => setTimeout(resolve, 300));

            const filename = `qr-code-${Date.now()}.png`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch QR code: ${response.status}`);
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');

            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            }, 100);

            showNotification(`QR Code downloaded successfully!`);

        } catch (error) {
            console.error("One-click download error:", error);
            alert("Failed to generate and download QR code. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const shareQRCode = () => {
        if (!qrUrl) {
            alert("Please generate a QR code first");
            return;
        }

        if (navigator.share) {
            navigator.share({
                title: 'QR Code',
                text: 'Check out this QR code',
                url: qrUrl,
            });
        } else {
            navigator.clipboard.writeText(qrUrl).then(() => {
                showNotification("QR Code URL copied to clipboard!");
            });
        }
    };

    const copyQRCodeToClipboard = async () => {
        if (!qrUrl) {
            alert("Please generate a QR code first");
            return;
        }

        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            showNotification("QR Code image copied to clipboard!");
        } catch (error) {
            console.error("Copy failed:", error);
            navigator.clipboard.writeText(qrUrl).then(() => {
                showNotification("QR Code URL copied to clipboard!");
            });
        }
    };

    const showNotification = (message) => {
        const notification = document.createElement("div");
        notification.className = "fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in";
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("animate-fade-out");
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    };

    const deleteHistoryItem = (id, e) => {
        if (confirm("Are you sure you want to delete this QR code?")) {
            e.stopPropagation();
            const newHistory = history.filter(item => item.id !== id);
            setHistory(newHistory);
            showNotification("History item deleted");
        }
    };

    const handleThemeChange = (foregroundColor, backgroundColor) => {
        setCustomization(prev => ({
            ...prev,
            foregroundColor: foregroundColor,
            backgroundColor: backgroundColor,
            isTransparent: false // Ensure transparent is off when applying themes
        }));
    };

    const handleMarginChange = (margin) => {
        setCustomization(prev => ({
            ...prev,
            margin: margin,
            hasMargin: margin !== "0"
        }));
    };

    // Reset customization to defaults
    const resetCustomization = () => {
        if (confirm("Hey! Are you sure you want to reset your Customize Appearance settings? This will remove your current changes.")) {
            setCustomization({
                foregroundColor: "#000000",
                backgroundColor: "#FFFFFF",
                margin: "4",
                hasMargin: true,
                isTransparent: false,
                eyeStyle: "square",
                hasLogo: false,
                logoUrl: "",
                logoSize: "20",
            });
        }
        showNotification("Customization reset to defaults");
    };

    const History_Info_Button = (item) => {
        let password = item.details?.passwordValue ||
            (item.details?.hasPassword ? "Password exists but not shown" : "No password");

        if (item.type === "WIFI") {
            alert(`WiFi Details:\nSSID: ${item.details?.wifiSSID || "Not found"}\nPassword: ${password}\nEncryption: ${item.details?.encryptionType || "Not found"}`);
        } else {
            let details = "";
            if (item.type === "EMAIL") {
                details = `Email Details:\nTo: ${item.details?.emailTo || "Not found"}\nSubject: ${item.details?.emailSubject || "None"}\nBody: ${item.details?.emailBody || "None"}`;
            }
            else if (item.type === "LINK") {
                details = `Link: ${item.details?.url || item.details?.preview || "Not found"}`;
            }
            else if (item.type === "TEXT") {
                details = `Text: ${item.details?.text || item.details?.preview || "Not found"}`;
            }
            else if (item.type === "MORE") {
                details = `Data: ${item.details?.data || item.details?.preview || "Not found"}`;
            }
            else {
                details = "Unknown QR type";
            }
            alert(details);
        }
    };

    // Email fields change handlers
    const handleEmailToChange = (e) => {
        setEmailTo(e.target.value);
    };

    const handleEmailSubjectChange = (e) => {
        setEmailSubject(e.target.value);
    };

    const handleEmailBodyChange = (e) => {
        setEmailBody(e.target.value);
    };

    // WiFi handlers
    const handleWifiInputChange = (e) => {
        setWifiSSID(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPasswordValue(e.target.value);
    };

    const Type_Selector = (e) => {
        setEncryptionType(e.target.value);
    };
     
    return (
        <>
            <div className="bg-linear-to-br from-blue-50 to-white">
                <div className="min-h-screen px-4 py-10 mt-2">
                    {/* header */}
                    <div>
                        <QrGene_Header />
                    </div>
                    {/* Main Layout */}
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto">
                        {/* LEFT PANEL */}
                        <div>
                            <div className="border-2 py-5.5 px-5 rounded-3xl bg-white shadow-sm border-slate-200">
                                {/* Form Component */}
                                <QrGene_Form
                                    // State values
                                    activeTab={activeTab}
                                    inputValue={inputValue}
                                    emailTo={emailTo}
                                    emailSubject={emailSubject}
                                    emailBody={emailBody}
                                    wifiSSID={wifiSSID}
                                    passwordValue={passwordValue}
                                    encryptionType={encryptionType}
                                    size={size}
                                    isGenerating={isGenerating}
                                    isDownloading={isDownloading}

                                    // Handler functions
                                    handleInputChange={(e) => setInputValue(e.target.value)}
                                    handleEmailToChange={handleEmailToChange}
                                    handleEmailSubjectChange={handleEmailSubjectChange}
                                    handleEmailBodyChange={handleEmailBodyChange}
                                    handleWifiInputChange={handleWifiInputChange}
                                    handlePasswordChange={handlePasswordChange}
                                    handleEncryptionTypeChange={Type_Selector}
                                    handleSizeChange={(e) => setSize(e.target.value)}
                                    generateQRCode={generateQRCode}
                                    handleOneClickDownload={handleOneClickDownload}
                                    setActiveTab={setActiveTab}
                                    setInputValue={setInputValue}
                                />
                            </div>

                            {/* Customize Appearance */}
                            <div className="block lg:hidden">
                                <QrGene_Qrpreview
                                    // State values
                                    qrUrl={qrUrl}
                                    size={size}
                                    customization={customization}
                                    isDownloading={isDownloading}
                                    // Handler functions
                                    downloadQRCode={downloadQRCode}
                                    copyQRCodeToClipboard={copyQRCodeToClipboard}
                                    shareQRCode={shareQRCode}
                                />
                            </div>
                            <div className="hidden lg:block">
                                <QrGene_Customize
                                    // State values
                                    customization={customization}
                                    // Handler functions
                                    resetCustomization={resetCustomization}
                                    handleThemeChange={handleThemeChange}
                                    handleMarginChange={handleMarginChange}
                                />
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div>
                            <div className="hidden lg:block flex-col">
                                <QrGene_Qrpreview
                                    // State values
                                    qrUrl={qrUrl}
                                    size={size}
                                    customization={customization}
                                    isDownloading={isDownloading}
                                    // Handler functions
                                    downloadQRCode={downloadQRCode}
                                    copyQRCodeToClipboard={copyQRCodeToClipboard}
                                    shareQRCode={shareQRCode}
                                />
                            </div>
                            <div className="block lg:hidden">
                                <QrGene_Customize
                                    // State values
                                    customization={customization}
                                    // Handler functions
                                    resetCustomization={resetCustomization}
                                    handleThemeChange={handleThemeChange}
                                    handleMarginChange={handleMarginChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {/* History Panel */}
                    <QrGene_History history={history} setHistory={setHistory} deleteHistoryItem={deleteHistoryItem} History_Info_Button={History_Info_Button} selectedHistoryItem={selectedHistoryItem} />
                </div>
            </div>
        </>
    );
}
