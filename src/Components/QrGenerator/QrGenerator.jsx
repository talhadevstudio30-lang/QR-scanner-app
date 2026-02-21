import { useState, useEffect, useRef,  useCallback } from "react";
import QrGene_Stored_History from "./QrGene-Stored-History";
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
        if (history.length === 0) {
            return;
        }

        const save = () => {
            localStorage.setItem("qrHistory", JSON.stringify(history));
        };

        if ("requestIdleCallback" in window) {
            const idleId = requestIdleCallback(save);
            return () => cancelIdleCallback(idleId);
        }

        const timeoutId = setTimeout(save, 200);
        return () => clearTimeout(timeoutId);
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
    const generateWifiQRData = useCallback(() => {
        if (!wifiSSID.trim()) {
            return "";
        }

        const passwordPart = passwordValue ? `P:${passwordValue};` : "";
        return `WIFI:S:${wifiSSID};T:${encryptionType};${passwordPart};`;
    }, [wifiSSID, passwordValue, encryptionType]);

    // Function to generate Email QR code data format
    const generateEmailQRData = useCallback(() => {
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
    }, [emailTo, emailSubject, emailBody]);

    // Function to build QR code URL with customization - ALWAYS PNG
    const buildQrUrl = useCallback((dataToEncode) => {
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
    }, [size, customization]);

    // Function to get detailed information for history item
    const getHistoryDetails = useCallback(() => {
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
            case "DATA":
                return {
                    data: inputValue,
                    preview: inputValue.length > 50 ? inputValue.substring(0, 50) + "..." : inputValue
                };
            default:
                return {};
        }
    }, [activeTab, emailTo, emailSubject, emailBody, wifiSSID, passwordValue, encryptionType, inputValue]);

    // Function to add QR code to history
    const addToHistory = useCallback((dataToEncode, generatedUrl) => {
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
        setHistory(prev => [historyItem, ...prev].slice(0, 50));
    }, [activeTab, size, customization, getHistoryDetails]);

    // 1️⃣ prepare data (shared logic)
    const getDataToEncode = useCallback(() => {
        let dataToEncode = inputValue;

        if (activeTab === "WIFI") {
            const wifiData = generateWifiQRData();
            if (!wifiData) {
                alert("Please enter WiFi Network Name (SSID)");
                return null;
            }
            dataToEncode = wifiData;
        }
        else if (activeTab === "EMAIL") {
            const emailData = generateEmailQRData();
            if (!emailData) {
                alert("Please enter at least an email address");
                return null;
            }
            dataToEncode = emailData;
        }
        else if (!inputValue.trim()) {
            alert("Please enter some data to generate QR code");
            return null;
        }
        return dataToEncode;
    }, [activeTab, inputValue, generateWifiQRData, generateEmailQRData]);

    // 3️⃣ build QR
    const build_QR = useCallback((dataToEncode) => {
        let url = buildQrUrl(dataToEncode);
        setQrUrl(url);
        return url;
    }, [buildQrUrl]);

    // 2️⃣ generator → only handles loading state
    const generateQRCode = useCallback(() => {
        const data = getDataToEncode();
        if (!data) return;
        setIsGenerating(true);
        setTimeout(() => {
            build_QR(data);
            setIsGenerating(false);
        }, 500);
    }, [getDataToEncode, build_QR]);
  const notificationTimeoutRef = useRef(null);
  const stylesInjectedRef = useRef(false);
   // ===== INJECT STYLES ONLY ONCE =====
    useEffect(() => {
      if (!stylesInjectedRef.current) {
        const animationStyles = `
          @keyframes slideIn {
            from {
              transform: translateX(100%) scale(0.9);
              opacity: 0;
            }
            to {
              transform: translateX(0) scale(1);
              opacity: 1;
            }
          }
  
          @keyframes slideOut {
            from {
              transform: translateX(0) scale(1);
              opacity: 1;
            }
            to {
              transform: translateX(100%) scale(0.9);
              opacity: 0;
            }
          }
  
          @keyframes progressBar {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
  
          .animate-slide-in {
            animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
  
          .animate-slide-out {
            animation: slideOut 0.3s ease-in forwards;
          }
  
          .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            animation: progressBar 2s linear forwards;
          }
        `;
  
        const styleSheet = document.createElement("style");
        styleSheet.textContent = animationStyles;
        document.head.appendChild(styleSheet);
        stylesInjectedRef.current = true;
      }
  
      return () => {
        // Clean up notification container on unmount
        const container = document.getElementById('notification-container');
        if (container) {
          container.remove();
        }
      };
    }, []);
  
    // ===== NOTIFICATION FUNCTION =====
    const showNotification = useCallback((message, type = 'success') => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
  
      let notificationContainer = document.getElementById('notification-container');
      if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-3';
        document.body.appendChild(notificationContainer);
      }
  
      const notification = document.createElement('div');
  
      const typeStyles = {
        success: 'bg-white/90 backdrop-blur-md border-l-4 border-blue-500 text-gray-800',
        error: 'bg-white/90 backdrop-blur-md border-l-4 border-red-500 text-gray-800',
        warning: 'bg-white/90 backdrop-blur-md border-l-4 border-amber-500 text-gray-800',
        info: 'bg-white/90 backdrop-blur-md border-l-4 border-blue-400 text-gray-800'
      };
  
      const icons = {
        success: `
          <div class="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        `,
        error: `
          <div class="w-8 h-8 rounded-full bg-red-100/80 flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        `,
        warning: `
          <div class="w-8 h-8 rounded-full bg-amber-100/80 flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        `,
        info: `
          <div class="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        `
      };
  
      notification.className = `${typeStyles[type]} px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-x-0 opacity-100 flex items-center gap-3 min-w-[340px] max-w-md border border-white/20 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden`;
  
      notification.innerHTML = `
        <div class="shrink-0">
          ${icons[type]}
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-800">${message}</p>
          <p class="text-xs text-gray-500 mt-0.5">${new Date().toLocaleTimeString()}</p>
        </div>
        <button class="shrink-0 w-6 h-6 rounded-full bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all duration-200 focus:outline-none group" aria-label="Close">
          <svg class="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      `;
  
      const progressBar = document.createElement('div');
      progressBar.className = 'notification-progress';
      progressBar.style.width = "90%";
      notification.appendChild(progressBar);
  
      while (notificationContainer.firstChild) {
        notificationContainer.removeChild(notificationContainer.firstChild);
      }
  
      notificationContainer.appendChild(notification);
      notification.classList.add('animate-slide-in');
  
      const closeButton = notification.querySelector('button');
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removeNotification(notification);
      });
  
      notificationTimeoutRef.current = setTimeout(() => {
        removeNotification(notification);
      }, 2000);
  
      const removeNotification = (notificationElement) => {
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
          notificationTimeoutRef.current = null;
        }
  
        notificationElement.classList.add('animate-slide-out');
  
        setTimeout(() => {
          if (notificationElement.parentNode) {
            notificationElement.parentNode.removeChild(notificationElement);
  
            if (notificationContainer.children.length === 0) {
              notificationContainer.remove();
            }
          }
        }, 300);
      };
    }, []);

    // Enhanced download functionality
    const downloadQRCode = useCallback(async () => {
        if (!qrUrl) {
            alert("Please generate a QR code first");
            return;
        }

        setIsDownloading(true);

        try {
            const filename = `Adevt-Qr-Code-${Date.now()}.png`;
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
    }, [qrUrl, showNotification]);

    // One-click download with auto-generation
    const handleOneClickDownload = useCallback(() => {
        const dataToEncode = getDataToEncode();
        if (!dataToEncode) return;
        const url = buildQrUrl(dataToEncode);
        setQrUrl(url);
        addToHistory(dataToEncode, url);
         showNotification('Generated & Saved');
    }, [getDataToEncode, buildQrUrl, addToHistory]);

    const shareQRCode = useCallback(() => {
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
    }, [qrUrl, showNotification]);

    const copyQRCodeToClipboard = useCallback(async () => {
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
    }, [qrUrl, showNotification]);

    const deleteHistoryItem = useCallback((id, e) => {
        if (confirm("Are you sure you want to delete this QR code?")) {
            e.stopPropagation();
            setHistory(prev => prev.filter(item => item.id !== id));
            showNotification("History item deleted");
        }
    }, [showNotification]);

    const handleThemeChange = useCallback((foregroundColor, backgroundColor) => {
        setCustomization(prev => ({
            ...prev,
            foregroundColor: foregroundColor,
            backgroundColor: backgroundColor,
            isTransparent: false // Ensure transparent is off when applying themes
        }));
    }, []);

    const handleMarginChange = useCallback((margin) => {
        setCustomization(prev => ({
            ...prev,
            margin: margin,
            hasMargin: margin !== "0"
        }));
    }, []);

    // Reset customization to defaults
    const resetCustomization = useCallback(() => {
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
    }, [showNotification]);

    const History_Info_Button = useCallback((item) => {
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
            else if (item.type === "DATA") {
                details = `Data: ${item.details?.data || item.details?.preview || "Not found"}`;
            }
            else {
                details = "Unknown QR type";
            }
            alert(details);
        }
    }, []);

    // Email fields change handlers
    const handleEmailToChange = useCallback((e) => {
        setEmailTo(e.target.value);
    }, []);

    const handleEmailSubjectChange = useCallback((e) => {
        setEmailSubject(e.target.value);
    }, []);

    const handleEmailBodyChange = useCallback((e) => {
        setEmailBody(e.target.value);
    }, []);

    // WiFi handlers
    const handleWifiInputChange = useCallback((e) => {
        setWifiSSID(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e) => {
        setPasswordValue(e.target.value);
    }, []);

    const Type_Selector = useCallback((e) => {
        setEncryptionType(e.target.value);
    }, []);

    const handleInputChange = useCallback((e) => {
        setInputValue(e.target.value);
    }, []);

    const handleSizeChange = useCallback((e) => {
        setSize(e.target.value);
    }, []);

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
                            <div className="border-2 py-5 px-4 rounded-3xl bg-white shadow-sm border-slate-200">
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
                                    handleInputChange={handleInputChange}
                                    handleEmailToChange={handleEmailToChange}
                                    handleEmailSubjectChange={handleEmailSubjectChange}
                                    handleEmailBodyChange={handleEmailBodyChange}
                                    handleWifiInputChange={handleWifiInputChange}
                                    handlePasswordChange={handlePasswordChange}
                                    handleEncryptionTypeChange={Type_Selector}
                                    handleSizeChange={handleSizeChange}
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
                    <QrGene_Stored_History history={history} setHistory={setHistory} deleteHistoryItem={deleteHistoryItem} History_Info_Button={History_Info_Button} selectedHistoryItem={selectedHistoryItem} />
                </div>
            </div>
        </>
    );
}
