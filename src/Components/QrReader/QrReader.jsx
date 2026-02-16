import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import QrRead_Header from "./QrRead-Header";
import QrRead_Scan_Result from "./QrRead-Scan-Result";
import QrRead_Scan_History from "./QrRead-Scan-History";
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
  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const streamRef = useRef(null);

  const qrFoundRef = useRef(false);
  const scanningRef = useRef(false);

  // Load history from localStorage on mount
  useEffect(() => {
    loadHistoryFromStorage();
    return () => stopCamera();
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    saveHistoryToStorage();
  }, [saveHistoryToStorage]);

  // Load history from localStorage
  const loadHistoryFromStorage = () => {
    try {
      const savedHistory = localStorage.getItem("qrScanHistory");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Ensure each item has all required fields
        const validated = parsed.filter(item =>
          item && item.id && item.data && item.timestamp
        );
        setScanHistory(validated);
        console.log("History loaded from localStorage:", validated.length, "items");
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage:", e);
      // If there's an error, clear corrupted data
      localStorage.removeItem("qrScanHistory");
    }
  };

  // Save history to localStorage
  const saveHistoryToStorage = useCallback(() => {
    try {
      if (scanHistory.length > 0) {
        const historyToSave = JSON.stringify(scanHistory);
        localStorage.setItem("qrScanHistory", historyToSave);
        console.log("History saved to localStorage:", scanHistory.length, "items");
      } else {
        // If history is empty, remove from localStorage
        localStorage.removeItem("qrScanHistory");
        console.log("History cleared from localStorage");
      }
    } catch (e) {
      console.error("Failed to save history to localStorage:", e);
    }
  }, [scanHistory]);

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
      // Check for duplicates (avoid adding the same QR code within 1 minute)
      const isDuplicate = prev.some(item =>
        item.data === data &&
        (Date.now() - new Date(item.timestamp).getTime()) < 60000
      );

      if (isDuplicate) {
        console.log("Duplicate scan ignored");
        return prev;
      }

      // Keep last 20 scans
      const updated = [newScan, ...prev].slice(0, 20);
      return updated;
    });
  };

  // Clear all history
  const clearHistory = () => {
    setScanHistory([]);
    // localStorage will be cleared by the useEffect
    console.log("History cleared");
  };

  // Remove single item from history
  const removeFromHistory = (id) => {
    setScanHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      return updated;
    });
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
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
  };

  // Get icon based on type
  const getIconForType = (type) => {
    switch (type) {
      case "URL": return <Link />;
      case "WiFi": return <Wifi />;
      case "Email": return <Mail />;
      case "Phone": return <Phone />;
      case "Contact": return <Contact />;
      default: return <Type />;
    }
  };

  // Check if QR data is URL
  const isURL = qrData && (qrData.startsWith("http://") ||
    qrData.startsWith("https://") || qrData.startsWith("www.") || qrData.includes(".com") || qrData.includes(".net") || qrData.includes(".org") || qrData.includes(".io") || qrData.includes(".app") || qrData.includes(".dev") || qrData.includes(".ai") || qrData.includes(".co") || qrData.includes(".in") || qrData.includes(".us") || qrData.includes(".uk"));

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

      const capture = document.createElement("canvas");
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
            addToHistory(data);
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
        addToHistory(data);
      } else {
        setError("No QR code found in the image");
      }
    } catch {
      setError("Failed to read QR code. Please try again.");
    } finally {
      setLoading(false);
    }
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
    setPreview(null);
    setLoading(false);
    qrFoundRef.current = false;
    scanningRef.current = false;
    setCopySuccess(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

            // Handler props
            handleCopy={handleCopy}
            handleShare={handleShare}
            handleClear={handleClear}
          />
        </div>

        {/* Recent Scans Section */}
        <div>
          <QrRead_Scan_History
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

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
