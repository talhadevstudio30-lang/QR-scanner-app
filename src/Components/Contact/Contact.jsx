import React, { Suspense } from "react";
import Contact_Left_Side from "./Contact-Left-Side";
import Contact_Right_Side from "./Contact-Right-Side";

const Contact = () => {

    return (
        <div className="min-h-screen  px-4 py-10 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
                    {/* LEFT SIDE */}
                    <Contact_Left_Side />

                    {/* RIGHT SIDE */} 
                    <Contact_Right_Side />
                </div>
            </div>
        </div>
    );
};

export default Contact;