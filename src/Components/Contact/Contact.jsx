import React from "react";
import Swal from "sweetalert2";
import { Mail , ContactRound , SquareArrowUpRight , MessageCircle } from 'lucide-react';
import { div } from "framer-motion/client";


const Contact = () => {

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append("access_key", "84103146-94bf-481d-939d-410c80067962");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            Swal.fire({
                title: "Successfully Sended",
                icon: "success",
                draggable: true,
                confirmButtonText: "Close",
                buttonsStyling: false,

                didOpen: () => {
                    const popup = Swal.getPopup();

                    // 🎯 Popup styling (rounded-3xl + glass effect)
                    popup.style.borderRadius = "1.5rem";

                    // 🎯 Backdrop blur
                    const backdrop = document.querySelector(".swal2-backdrop-show");
                    if (backdrop) {
                        backdrop.style.background = "rgba(0,0,0,0.3)";
                        backdrop.style.backdropFilter = "blur(4px)";
                        backdrop.style.webkitBackdropFilter = "blur(4px)";
                    }

                    // 🎯 Confirm button styling
                    const confirmButton = popup.querySelector(".swal2-confirm");
                    if (confirmButton) {
                        confirmButton.style.backgroundColor = "#0000ff";
                        confirmButton.style.color = "#ffffff";
                        confirmButton.style.border = "none";
                        confirmButton.style.borderRadius = "13px";
                        confirmButton.style.padding = "10px 24px";
                        confirmButton.style.fontSize = "16px";
                        confirmButton.style.fontWeight = "500";
                        confirmButton.style.cursor = "pointer";
                        confirmButton.style.transition = "all 0.2s ease";
                    }
                }
            });
            event.target.reset();
        } else {
            setResult("Error");
        }
    };
    return (
        <div className="min-h-screen  px-4 py-10 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
                    {/* LEFT SIDE */}
                    <section className="pt-6 lg:pt-10">
                        <h1 className="text-[31px] text-gray-800 md:text-[38px] text-center lg:text-start font-bold tracking-tight lg:text-[40px]">
                            Let&apos;s get in touch
                        </h1>

                        <p className="mt-2 text-base w-full leading-8 text-center lg:text-start  text-slate-600 sm:text-lg">
                            Whether you have a question about features, trials, pricing, need a demo,
                            or anything else, our team is ready to answer all your questions.
                        </p>

                        {/* Email Card */}
                        <a
                            href="mailto:talhadevstudio30@gmail.com"

                        >

                            <div className="mt-5 rounded-2xl cursor-pointer bg-white p-3 shadow-[0_10px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 sm:p-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                                        <Mail className="h-6 w-6 text-blue-600" />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-950">Email Us</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            We aim to reply within 24 hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>

                        {/* Social Card */}
                        <div className="mt-5 rounded-2xl bg-white p-3 shadow-[0_10px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 sm:p-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                                    <ContactRound className="h-6 w-6 text-blue-600"/>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-slate-950">Connect with us</h3>

                                    <div className="mt-2 flex flex-wrap gap-4 text-sm sm:text-base">
                                        <a
                                            href="https://www.linkedin.com/in/talha-javed-080033315/"
                                            className="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
                                        >
                                            <SquareArrowUpRight className="h-5 w-5"/>
                                            LinkedIn
                                        </a>

                                        <a
                                            href="https://wa.me/923136367889?text=hi"
                                            className="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
                                        >
                                           <MessageCircle className="h-5 w-5" />
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT SIDE */}
                    <section className="lg:pt-2">
                        <form
                            onSubmit={onSubmit}
                            className="rounded-[28px] bg-white p-5 shadow-[0_14px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 sm:p-3 lg:p-4 lg:mt-8 mt-1.5"
                        >
                            <div className="grid gap-4 grid-cols-1">
                                <input
                                    type="text" name="name" required
                                    placeholder="First Name"
                                    className="h-14 w-full rounded-xl border border-slate-200 px-4 text-[15px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div className="mt-4">
                                <input
                                    type="email" name="email" required
                                    placeholder="Work Email"
                                    className="h-14 w-full rounded-xl border border-slate-200 px-4 text-[15px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div className="mt-4">
                                <textarea
                                    name="message" required
                                    placeholder="Message"
                                    rows={6}
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-4 text-[15px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                            <div className="md:flex justify-center items-center grid grid-cols-1 md:flex-cols-2">
                                <button
                                    type="submit"
                                    className="mt-6 h-14 w-full rounded-xl bg-blue-600  flex justify-center items-center text-white font-semibold hover:bg-blue-700 active:scale-[0.99] mx-1.5"
                                >
                                    Send Message
                                </button>
                                <button
                                    type="reset"
                                    className="mt-6 h-14 w-full rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold active:scale-[0.99] mx-1.5"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Contact;