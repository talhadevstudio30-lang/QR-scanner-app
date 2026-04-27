import React from 'react';
import Swal from "sweetalert2";

function Contact_Right_Side() {

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
                            className="sm:mt-6 mt-3 h-14 w-full rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold active:scale-[0.99] mx-1.5"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </section>
    )
}

export default Contact_Right_Side
