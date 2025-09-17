import * as React from "react";
import { CornerArc, CheckIcon } from "../../assets/icons/icons.tsx";
import AnimatedWrapper from "../../AnimatedWrapper.tsx";

const Hero: React.FC = () => {
    return (
        <section className="relative container mx-auto px-6 py-24 sm:py-32 lg:py-40 text-center">
            {/* Top-left corner */}
            <AnimatedWrapper className="absolute top-10 left-[150px] opacity-50 hidden md:block">
                <CornerArc className="w-13 h-13" />
            </AnimatedWrapper>

            {/* Top-right corner */}
            <AnimatedWrapper className="absolute top-10 right-[150px] opacity-50 hidden md:block" delay={100}>
                <CornerArc className="w-13 h-13 rotate-90" />
            </AnimatedWrapper>

            {/* Bottom-left corner */}
            <AnimatedWrapper className="absolute bottom-10 left-[150px] opacity-50 hidden md:block" delay={200}>
                <CornerArc className="w-13 h-13 -rotate-90" />
            </AnimatedWrapper>

            {/* Bottom-right corner */}
            <AnimatedWrapper className="absolute bottom-10 right-[150px] opacity-50 hidden md:block" delay={300}>
                <CornerArc className="w-13 h-13 rotate-180" />
            </AnimatedWrapper>

            <div className="relative z-10">
                <AnimatedWrapper>
                    <div style={{ borderRadius: "53.22px", display: "flex", justifyContent: "center", alignItems: "center" }} className="bg-[#F2F2F2] mx-auto w-[190.596923828125px] h-[31.236923217773438px]">
                        <p className="text-milo-purpl text-[#000000] text-[11.57px] font-semibold tracking-wider">MOBILE APP COMING SOON</p>
                    </div>
                </AnimatedWrapper>
                <AnimatedWrapper delay={100}>
                    <h1 style={{ lineHeight: "110px", fontFamily: "poppins" }} className="text-5xl md:text-[99.55px] font-bold text-milo-dark-purpl bg-gradient-to-r from-[#7062FF] to-[#362F7B] bg-clip-text text-transparent leading-tight">
                        Finance that <br /> talks back.
                    </h1>
                </AnimatedWrapper>
                <AnimatedWrapper delay={200}>
                    <p className="max-w-xl mx-auto mt-6 text-lg text-gray-600">
                        MILO is the first conversational wallet. Send, swap, and manage crypto & Naira, all in your own language.
                    </p>
                </AnimatedWrapper>
                <AnimatedWrapper delay={300}>
                    <button className="mt-10 bg-milo-dark-purple text-white font-bold py-4 px-8 rounded-full flex items-center justify-center mx-auto group transition-all duration-300 hover:scale-105 shadow-lg">
                        <div className="bg-milo-purple p-1 rounded-full mr-3 group-hover:rotate-12 transition-transform">
                            <CheckIcon className="w-5 h-5" />
                        </div>
                        GET EARLY ACCESS
                    </button>
                </AnimatedWrapper>
            </div>
        </section>
    );
};

export default Hero;
