import React, { Suspense, lazy } from "react";
import Header from "./Components/Header/Header";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import QrGenerator from "./Components/QrGenerator/QrGenerator";

const QrReader = lazy(() => import("./Components/QrReader/QrReader"));
const ApiDocs = lazy(() => import("./Components/ApiDocs"));
const About = lazy(() => import("./Components/About"));

function AppLayout() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Outlet />
      </Suspense>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <QrGenerator /> },
      { path: "generator", element: <QrGenerator /> },
      { path: "api-docs", element: <ApiDocs /> },
      { path: "scanner", element: <QrReader /> },
      { path: "About", element: <About /> },
    ],
  },
]);

export default function QRFetcher() {
  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>

  );
}
