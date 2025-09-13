import React, { useState, useEffect } from 'react';
import logo from '../../assets/icons/logo.png'

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


    return (
        <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <img src={logo} className="h-9 w-auto"/>

                    <nav className="hidden relative left-[50px] lg:flex items-center space-x-8">
                        <a href="#" className="text-milo-dark-purple font-medium hover:text-milo-purple transition-colors">Docs</a>
                        <a href="#" className="text-milo-dark-purple font-medium hover:text-milo-purple transition-colors">Features</a>
                        <a href="#" className="text-milo-dark-purple font-medium hover:text-milo-purple transition-colors">About</a>
                    </nav>

                    <div className="hidden lg:block">
                        <button className="bg-milo-purple text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">
                            Connect Wallet
                        </button>
                    </div>

                    <div className="lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-milo-dark-purple focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="lg:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
                        <nav className="flex flex-col space-y-4">
                            <a href="#" className="text-milo-dark-purple font-medium hover:text-milo-purple transition-colors">Ideas</a>
                            <a href="#" className="text-milo-dark-purple font-medium hover:text-milo-purple transition-colors">Features</a>
                            <a href="#" className="text-milo-dark-purple font-medium hover:text-milo-purple transition-colors">About</a>
                            <button className="bg-milo-purple text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity w-full">
                                Connect Wallet
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
export default Header;
