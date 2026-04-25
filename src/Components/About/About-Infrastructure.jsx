import React from "react";
import { Plus, Code, QrCode } from "lucide-react";

const Cards = [
    {
        title: "GENERATION",
        description: `Create high-resolution, custom QR codes in milliseconds.
Support for dynamic links, vCards, and WiFi configurations.`,
        icon: Code
    },
    {
        title: "SCANNING",
        description: `Lightning-fast recognition software capable of reading damaged or
low-contrast codes across any device environment.`,
        icon: QrCode
    },
    {
        title: "DEVELOPER API",
        description: `Robust REST endpoints and SDKs to integrate QR directly into your
existing software stack and CI/CD pipelines.`,
        icon: Plus
    }
];

function About_Infrastructure() {
    return (
        <section className="px-4 pb-20">
            <div className="max-w-6xl mx-auto text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold">
                    Core Infrastructure
                </h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    Enterprise-grade tools for modern workflows.
                </p>
            </div>

            {/* CARDS */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {Cards.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-3xl p-6 text-left shadow-sm hover:shadow-md transition"
                        >
                            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg mb-4">
                                <Icon className="text-blue-600 w-5 h-5" />
                            </div>

                            <h3 className="text-sm font-semibold mb-2">{item.title}</h3>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default About_Infrastructure;