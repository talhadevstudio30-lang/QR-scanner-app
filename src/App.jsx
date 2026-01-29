import React, { useState, useEffect } from "react";
import QrReader from "./Components/QrReader";

export default function QRFetcher() {
  const [qrUrl, setQrUrl] = useState("");
  const [Data_Value , setData_Value] = useState("");

  const Data_Input = (event) => {
     setData_Value(event.target.value);
     console.log(event.target.value);
  }

  const fetchData = () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(Data_Value)}`;
    setQrUrl(url);
  }
  
  return (
    <>
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {qrUrl ? (
        <img src={qrUrl} alt="QR Code" width={250} height={250} />
      ) : (
        <p>Enter Your Data and Generate Your QR</p>
      )}
      <button onClick={() => fetchData()}>Generate</button>
      <input type="text" value={Data_Value} onChange={Data_Input} />
    </div>
    <div>
      <QrReader />
    </div>
    </>
     
  );
}