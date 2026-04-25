import React from 'react';
import { Mail , ContactRound , SquareArrowUpRight , MessageCircle } from 'lucide-react';

function Contact_Left_Side() {
    return (
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
                        <ContactRound className="h-6 w-6 text-blue-600" />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-950">Connect with us</h3>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm sm:text-base">
                            <a
                                href="https://www.linkedin.com/in/talha-javed-080033315/"
                                className="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
                            >
                                <SquareArrowUpRight className="h-5 w-5" />
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
    )
}

export default Contact_Left_Side;
