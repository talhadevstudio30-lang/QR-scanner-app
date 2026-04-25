import React from 'react';
import { Rocket } from "lucide-react";

function About_Mission() {
    return (
        <>
            <section className="px-4 pb-16">
                <div className="max-w-4xl lg:max-w-5xl mx-auto bg-[#ffffff] rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">

                    <div className="flex justify-center mb-3">
                        <Rocket className="text-blue-600 w-6 h-6 md:w-7.5 md:h-7.5" />
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
                        Our Mission
                    </h2>

                    <p className="text-gray-600 italic text-sm lg:text-[17px] sm:text-base max-w-xl mx-auto">
                        "Our mission is to simplify digital connections through reliable QR
                        technology."
                    </p>
                </div>
            </section>
        </>
    )
}

export default About_Mission;
