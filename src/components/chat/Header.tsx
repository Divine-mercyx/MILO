import React, { useState, useEffect } from 'react';
import {Clock, CustomerCare, Logo} from "../../assets/icons/icons.tsx";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/95 backdrop-blur-lg shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm shadow-sm'
            }`}>
                <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
                    <div className="lg:pl-[290px] md:pl-[200px] md:pr-[200px] lg:pr-[290px] flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            {/*<img src={logo} className="h-8 sm:h-9 w-auto" alt="Logo"/>*/}
                            <Logo />
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-4">
                            <button className="group relative text-white rounded-l-3xl font-semibold flex items-center gap-3 px-8 py-3 bg-[#6C55F5] backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                                Features
                            </button>
                            <button className="group relative border border-[#6C55F5] font-semibold text-[#6C55F5] flex items-center gap-3 px-8 py-3 backdrop-blur-xl rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                                Contacts
                            </button>
                            <button className="group relative border border-[#6C55F5] rounded-r-3xl text-[#6C55F5] font-semibold flex items-center gap-3 px-8 py-3 backdrop-blur-xl rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                                Docs
                            </button>
                        </nav>

                        {/* Desktop Icons & Mobile Menu Button */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Desktop Icons */}
                            <div className="hidden lg:flex items-center space-x-4">
                                <CustomerCare className="w-7 h-7 text-[#6C55F5] hover:text-[#5a47d1] transition-colors cursor-pointer"/>
                                <Clock className="w-7 h-7 text-[#6C55F5] hover:text-[#5a47d1] transition-colors cursor-pointer"/>
                            </div>

                            {/* Mobile Icons */}
                            <div className="flex lg:hidden items-center space-x-3">
                                <CustomerCare className="w-6 h-6 text-[#6C55F5]"/>
                                <Clock className="w-6 h-6 text-[#6C55F5]"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 pb-4 sm:pb-6 lg:pb-8">
                    <nav className="lg:hidden md:hidden flex items-center justify-center mt-[60px] space-x-4">
                        <button className="group relative text-white rounded-l-3xl font-semibold flex items-center gap-3 px-5 py-3 bg-[#6C55F5] backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                            Features
                        </button>
                        <button className="group relative border border-[#6C55F5] font-semibold text-[#6C55F5] flex items-center gap-3 px-5 py-3 backdrop-blur-xl rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                            Contacts
                        </button>
                        <button className="group relative border border-[#6C55F5] rounded-r-3xl text-[#6C55F5] font-semibold flex items-center gap-3 px-5 py-3 backdrop-blur-xl rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                            Docs
                        </button>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;
