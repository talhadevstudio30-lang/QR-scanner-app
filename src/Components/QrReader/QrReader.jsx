import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import QrRead_Header from "./QrRead-Header";
import QrRead_Scan_Result from "./QrRead-Scan-Result";
import QrRead_History from "./QrRead-History";
import QrRead_Scan_Cont from "./QrRead-Scan-Cont";
import {
  Link,
  Type,
  Mail,
  Wifi,
  Phone,
  Contact,
} from "lucide-react";

export default function QrReader() {
  const [mode, setMode] = useState("upload");
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  const stylesInjectedRef = useRef(false);

  const qrFoundRef = useRef(false);
  const scanningRef = useRef(false);

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

  // Load history from localStorage
  const loadHistoryFromStorage = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem("qrScanHistory");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        const validated = parsed.filter(item =>
          item && item.id && item.data && item.timestamp
        );
        setScanHistory(validated);
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage:", e);
      localStorage.removeItem("qrScanHistory");
    }
  }, []);

  // Detect QR code type
  const detectQRType = (data) => {
    if (data.startsWith("http://") || data.startsWith("https://")) return "URL";
    if (data.startsWith("WIFI:")) return "WiFi";
    if (data.startsWith("mailto:")) return "Email";
    if (data.startsWith("tel:")) return "Phone";
    if (data.startsWith("BEGIN:VCARD")) return "Contact";
    return "Text";
  };

  // Add to history
  const addToHistory = (data) => {
    if (!data) return;

    const type = detectQRType(data);
    const newScan = {
      id: Date.now(),
      data,
      type,
      timestamp: new Date().toISOString(),
    };

    setScanHistory(prev => {
      const isDuplicate = prev.some(item =>
        item.data === data &&
        (Date.now() - new Date(item.timestamp).getTime()) < 60000
      );

      if (isDuplicate) {
        showNotification(`Duplicate scan ignored`, 'warning');
        return prev;
      }

      const updated = [newScan, ...prev].slice(0, 20);
      showNotification(`QR Code saved to history`, 'success');
      return updated;
    });
  };

  // Clear all history
  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your saved scan history? 🗑️")) {
      setScanHistory([]);
    }
  };

  // Remove single item from history
  const removeFromHistory = (id) => {
    setScanHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      showNotification('Item removed from history', 'info');
      return updated;
    });
  };

  // Format timestamp for display
  const formatTimestamp = useCallback((timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  }, []);

  // Get icon based on type
  const getIconForType = useCallback((type) => {
    switch (type) {
      case "URL": return <Link />;
      case "WiFi": return <Wifi />;
      case "Email": return <Mail />;
      case "Phone": return <Phone />;
      case "Contact": return <Contact />;
      default: return <Type />;
    }
  }, []);

  const isURL = useMemo(() => {
    if (!qrData) return false;
    return (
      qrData.startsWith("http://") ||
      qrData.startsWith("https://") ||
      qrData.startsWith("www.") ||
      qrData.endsWith(".com") ||
      qrData.endsWith(".net") ||
      qrData.endsWith(".org") ||
      qrData.endsWith(".io") ||
      qrData.endsWith(".app") ||
      qrData.endsWith(".dev") ||
      qrData.endsWith(".ai") ||
      qrData.endsWith(".co") ||
      qrData.endsWith(".in") ||
      qrData.endsWith(".us") ||
      qrData.endsWith(".uk")
    );
  }, [qrData]);

  // Start camera
  const startCamera = async () => {
    try {
      setError("");
      setQrData(null);
      qrFoundRef.current = false;
      scanningRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setTimeout(startScanning, 600);
    } catch {
      setError("Camera permission denied. Please check your browser settings.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // Start scanning
  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(() => {
      if (!videoRef.current || qrFoundRef.current || scanningRef.current) return;

      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      // Check if screen width is medium or larger (768px and above)
      const isMdOrLarger = window.innerWidth >= 768;

      // Calculate the size for the scanner box
      // Smaller for md+ devices (50%), default for mobile (65%)
      const sizePercent = isMdOrLarger ? 0.45 : 0.65;
      const size = Math.min(video.videoWidth, video.videoHeight) * sizePercent;

      // Center the capture area
      const sx = (video.videoWidth - size) / 2;
      const sy = (video.videoHeight - size) / 2;

      const capture = captureCanvasRef.current || document.createElement("canvas");
      if (!captureCanvasRef.current) {
        captureCanvasRef.current = capture;
      }
      capture.width = size;
      capture.height = size;
      const capCtx = capture.getContext("2d");
      capCtx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

      // Draw overlay
      const overlay = canvasRef.current;
      if (overlay) {
        const container = overlay.parentElement;
        if (!container) return;

        // Get the actual displayed dimensions of the container
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Set canvas to match container dimensions exactly
        overlay.width = containerWidth;
        overlay.height = containerHeight;

        const octx = overlay.getContext("2d");
        octx.clearRect(0, 0, containerWidth, containerHeight);

        // Calculate scaling factors between video dimensions and displayed container
        const scaleX = containerWidth / video.videoWidth;
        const scaleY = containerHeight / video.videoHeight;

        // Use the smaller scale to maintain aspect ratio (like object-cover)
        const scale = Math.max(scaleX, scaleY);

        // Calculate the actual displayed video dimensions
        const displayWidth = video.videoWidth * scale;
        const displayHeight = video.videoHeight * scale;

        // Calculate offsets to center the video (since we use object-cover)
        const offsetX = (containerWidth - displayWidth) / 2;
        const offsetY = (containerHeight - displayHeight) / 2;

        // Calculate the scanner box position in the displayed video
        const scannerSize = size * scale;
        const scannerX = offsetX + (sx * scale);
        const scannerY = offsetY + (sy * scale);

        // Draw semi-transparent overlay
        octx.fillStyle = "rgba(0,0,0,0.65)";
        octx.fillRect(0, 0, containerWidth, containerHeight);

        // Clear the scanner area (make it transparent)
        octx.clearRect(scannerX, scannerY, scannerSize, scannerSize);

        // Add a subtle glow effect to the cleared area
        octx.shadowColor = 'rgba(59, 130, 246, 0.5)';
        octx.shadowBlur = 15;
        octx.shadowOffsetX = 0;
        octx.shadowOffsetY = 0;

        // Draw the scanner border
        octx.strokeStyle = "#3b82f6";
        octx.lineWidth = Math.max(3, Math.round(Math.min(containerWidth, containerHeight) * 0.004));
        octx.strokeRect(scannerX + 1, scannerY + 1, scannerSize - 2, scannerSize - 2);

        // Reset shadow for corner drawing
        octx.shadowColor = 'transparent';

        // Draw animated corners
        const cornerLen = Math.max(25, scannerSize * 0.1);
        octx.lineWidth = Math.max(4, Math.round(octx.lineWidth * 1.2));
        octx.strokeStyle = "#3b82f6";

        // Helper function to draw corner
        const drawCorner = (x1, y1, x2, y2) => {
          octx.beginPath();
          octx.moveTo(x1, y1);
          octx.lineTo(x2, y2);
          octx.stroke();
        };

        // Top-left corner
        drawCorner(scannerX, scannerY + cornerLen, scannerX, scannerY);
        drawCorner(scannerX, scannerY, scannerX + cornerLen, scannerY);

        // Top-right corner
        drawCorner(scannerX + scannerSize, scannerY + cornerLen, scannerX + scannerSize, scannerY);
        drawCorner(scannerX + scannerSize - cornerLen, scannerY, scannerX + scannerSize, scannerY);

        // Bottom-left corner
        drawCorner(scannerX, scannerY + scannerSize - cornerLen, scannerX, scannerY + scannerSize);
        drawCorner(scannerX, scannerY + scannerSize, scannerX + cornerLen, scannerY + scannerSize);

        // Bottom-right corner
        drawCorner(scannerX + scannerSize, scannerY + scannerSize - cornerLen, scannerX + scannerSize, scannerY + scannerSize);
        drawCorner(scannerX + scannerSize - cornerLen, scannerY + scannerSize, scannerX + scannerSize, scannerY + scannerSize);
      }

      capture.toBlob(async (blob) => {
        if (!blob) return;
        scanningRef.current = true;

        const formData = new FormData();
        formData.append("file", blob, "scan.png");

        try {
          const res = await axios.post(
            "https://api.qrserver.com/v1/read-qr-code/",
            formData
          );

          const data = res?.data?.[0]?.symbol?.[0]?.data;
          if (data) {
            qrFoundRef.current = true;
            setQrData(data);
            stopCamera();
          } else {
            scanningRef.current = false;
          }
        } catch {
          scanningRef.current = false;
        }
      }, "image/png");
    }, 500);
  };

  // Handle file upload
  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    stopCamera();
    setMode("upload");
    setError("");
    setQrData(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://api.qrserver.com/v1/read-qr-code/",
        formData
      );

      const data = res?.data?.[0]?.symbol?.[0]?.data;
      if (data) {
        setQrData(data);
      } else {
        setError("No QR code found in the image");
      }
    } catch {
      setError("Failed to read QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Save_Btn = () => {
    if (!qrData) {
      setError("No QR data to save");
      return;
    }
    addToHistory(qrData);
    setError("");
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Share handler
  const handleShare = async () => {
    if (!qrData) return;

    if (!navigator.share) {
      await navigator.clipboard.writeText(qrData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      return;
    }
    try {
      await navigator.share({
        title: "QR Scan Result",
        text: qrData,
      });
    } catch {
      // User cancelled share
    }
  };

  // Copy handler
  const handleCopy = async () => {
    if (!qrData) return;
    await navigator.clipboard.writeText(qrData);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Clear handler
  const handleClear = () => {
    setQrData(null);
    setError("");
    showNotification("Cleared successfully", "info");
    setPreview(null);
    setLoading(false);
    qrFoundRef.current = false;
    scanningRef.current = false;
    setCopySuccess(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ===== USE EFFECTS =====
  useEffect(() => {
    loadHistoryFromStorage();
    return () => stopCamera();
  }, [loadHistoryFromStorage]);

  useEffect(() => {
    const save = () => {
      try {
        if (scanHistory.length > 0) {
          const historyToSave = JSON.stringify(scanHistory);
          localStorage.setItem("qrScanHistory", historyToSave);
        } else {
          localStorage.removeItem("qrScanHistory");
        }
      } catch (e) {
        console.error("Failed to save history to localStorage:", e);
      }
    };

    if ("requestIdleCallback" in window) {
      const idleId = requestIdleCallback(save);
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(save, 200);
    return () => clearTimeout(timeoutId);
  }, [scanHistory]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white mt-2">
      <div className="max-w-306 mx-auto p-4 md:p-8 space-y-6">

        {/* Header */}
        <div>
          <QrRead_Header />
        </div>

        {/* Main Scanner Container */}
        <div>
          <QrRead_Scan_Cont
            // State props
            mode={mode}
            preview={preview}
            loading={loading}
            error={error}

            // Ref props
            fileInputRef={fileInputRef}
            videoRef={videoRef}
            canvasRef={canvasRef}

            // Handler props
            setMode={setMode}
            stopCamera={stopCamera}
            setQrData={setQrData}
            setPreview={setPreview}
            setError={setError}
            startCamera={startCamera}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleFile={handleFile}

          />
        </div>

        {/* Scan Result */}
        <div>
          <QrRead_Scan_Result
            // State props
            qrData={qrData}
            copySuccess={copySuccess}
            isURL={isURL}
            Save_Btn={Save_Btn}
            // Handler props
            handleCopy={handleCopy}
            handleShare={handleShare}
            handleClear={handleClear}

          />
        </div>

        {/* Recent Scans Section */}
        <div>
          <QrRead_History
            // State props
            scanHistory={scanHistory}
            showHistory={showHistory}

            // Handler props
            setShowHistory={setShowHistory}
            clearHistory={clearHistory}
            removeFromHistory={removeFromHistory}

            // Helper function props
            getIconForType={getIconForType}
            formatTimestamp={formatTimestamp}

          />
        </div>
      </div>
    </div>
  );
}
