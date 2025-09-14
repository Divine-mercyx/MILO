import * as React from "react";
import Header from "../components/layout/Header.tsx";
import Hero from "../components/landing/Hero.tsx";
import Features from "../components/landing/Features.tsx";
import SignUp from "../components/landing/SignUp.tsx";
import Devices from "../components/landing/Devices.tsx";
import CTA from "../components/landing/CTA.tsx";
import Different from "../components/landing/Different.tsx";
import Footer from "../components/landing/Footer.tsx";
import About from "../components/landing/About.tsx";

const Website: React.FC = () => {
    return (
        <div className="bg-white font-sans text-milo-text overflow-x-hidden relative">
            <div className="absolute top-0 left-0 w-96 h-96 bg-milo-purple/10 rounded-full filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-[10vh] right-0 w-[40rem] h-[40rem] bg-milo-light-purple rounded-full filter blur-3xl opacity-50 translate-x-1/2"></div>
            <div className="absolute top-[150vh] left-0 w-[30rem] h-[30rem] bg-milo-purple/5 rounded-full filter blur-3xl opacity-50 -translate-x-1/2"></div>
            <div className="absolute top-[250vh] right-0 w-[35rem] h-[35rem] bg-milo-light-purple rounded-full filter blur-3xl opacity-60 translate-x-1/2"></div>

            <div className="relative z-10">
                <Header />
                <main>
                    <br />
                    <Hero />
                    <Features />
                    <SignUp />
                    <Devices />
                    <CTA />
                    <Different />
                    <About />
                </main>
                <Footer />
            </div>
        </div>
    )
}
export default Website;
