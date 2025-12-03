import React, { useState, useEffect } from 'react';
import logo from '../../assets/icons/logo.png';
import { WalletConnection } from "../landing/WalletConnection.tsx";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
    const currentAccount = useCurrentAccount();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/90 border-b border-gray-200 shadow-sm' 
                : currentAccount 
                    ? 'bg-white/80' 
                    : 'bg-white'
        }`}>
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <img src={logo} className="h-8 w-auto" alt="Logo" />
                            {/* <span className="text-lg font-semibold text-gray-900">AI Assistant</span> */}
                        </div>
                        
                        <nav className="hidden lg:flex items-center gap-6">
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-gray-50">
                                Features
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-gray-50">
                                Documentation
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-gray-50">
                                Blockchain
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-gray-50">
                                Support
                            </a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block">
                            <WalletConnection />
                        </div>
                        
                        <div className="lg:hidden">
                            <button 
                                onClick={() => setIsOpen(!isOpen)} 
                                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="lg:hidden mt-3 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                        <nav className="flex flex-col space-y-3 mb-4">
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded hover:bg-gray-50 transition-colors">
                                Features
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded hover:bg-gray-50 transition-colors">
                                Documentation
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded hover:bg-gray-50 transition-colors">
                                Blockchain
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded hover:bg-gray-50 transition-colors">
                                Support
                            </a>
                        </nav>
                        <WalletConnection />
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header;