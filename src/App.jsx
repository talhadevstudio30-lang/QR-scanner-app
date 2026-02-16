import React from "react";
import QrReader from "./Components/QrReader/QrReader";
import Header from "./Components/Header/Header";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ApiDocs from "./Components/ApiDocs";
import QrGenerator from "./Components/QrGenerator/QrGenerator";
import About from "./Components/About";

export default function QRFetcher() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Header /><QrGenerator /></>
    },
     {
      path: "/generator",
      element: <><Header /><QrGenerator /></>
    },
    {
      path: "/api-docs",
      element: <><Header /><ApiDocs /></>
    },
    {
      path: "/scanner",
      element: <><Header /><QrReader /></>
    },
     {
      path: "/About",
      element: <><Header /><About /></>
    },
  ])

  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
      
      {/* <div>
        <QrReader />
      </div> */}
    </>

  );
}
