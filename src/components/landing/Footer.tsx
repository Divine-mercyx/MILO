import * as React from "react";
import img1 from '../../assets/icons/img_16.png'
import {TwitterIcon, OoiIcon, TelegramIcon} from "../../assets/icons/icons.tsx";

const Footer: React.FC = () => {
    const footerLinks = {
        Product: ["Features", "Security", "Roadmap", "Documentation"],
        Resources: ["Help Center", "Community", "Developers", "Status"],
        Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"],
    };
    return (
        <footer className="bg-[#7062FF] text-white mt-20">
            <div className="container mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <img src={img1} className="h-10" alt="Milo Logo"/>
                        <p className="mt-4 text-indigo-200">Not a bank. Smarter than a wallet.</p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="w-10 h-10 flex items-center justify-center bg-white text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"><TwitterIcon className="w-5 h-5"/></a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center bg-white text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"><OoiIcon className="w-6 h-6"/></a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center bg-white text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"><TelegramIcon className="w-6 h-6 stroke-current"/></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.Product.map(link => <li key={link}><a href="#" className="text-indigo-200 hover:text-white">{link}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.Resources.map(link => <li key={link}><a href="#" className="text-indigo-200 hover:text-white">{link}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.Legal.map(link => <li key={link}><a href="#" className="text-indigo-200 hover:text-white">{link}</a></li>)}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-t border-indigo-500">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-indigo-200">
                    <p>© 2025 Milo. All rights reserved.</p>
                    <p className="mt-4 md:mt-0">Built on Sui Network</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer;
