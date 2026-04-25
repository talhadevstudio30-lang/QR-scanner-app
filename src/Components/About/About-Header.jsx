import React from 'react'
import { QrCode } from "lucide-react";

function About_Header() {
    return (
            <section className="text-center px-4 py-16 sm:py-20">
                <p className="text-xs lg:text-[14px] tracking-[0.3em] text-blue-600 font-medium mb-2">
                    INNOVATION IN ACCESS
                </p>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">
                    Making QR codes accessible
                    <br />
                    for everyone.
                </h1>

                <p className="text-gray-600 mt-4 max-w-xl mx-auto text-sm lg:text-[17px] sm:text-base">
                    We build high-performance infrastructure to bridge the gap between
                    physical and digital worlds with precision and speed.
                </p>

                {/* Divider */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <div className="h-px w-16 lg:w-19 bg-gray-300"></div>
                    <QrCode className="text-blue-600 w-4 h-4 lg:w-4.5 lg:h-4.5" />
                    <div className="h-px w-16 lg:w-19 bg-gray-300"></div>
                </div>
            </section>
    )
}

export default About_Header;
