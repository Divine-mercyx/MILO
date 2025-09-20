import React, { useState } from 'react';
import {Clock, CustomerCare, Logo} from "../../assets/icons/icons.tsx";
import {WalletConnection} from "../landing/WalletConnection.tsx";
import ContactModal from "../chatTest/ContactModal.tsx";

type Contact = {
    name: string;
    address: string;
};

interface ChatHeaderProps {
    addContact: (contact: Contact) => void;
    contacts: Contact[];
}


const ChatHeader: React.FC<ChatHeaderProps> = ({ addContact, contacts }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onAddContact = (contact: Contact) => {
        addContact(contact);
    }

    const onClose = () => {
        setIsOpen(false);
    }


    return (
        <>
            <div className="flex w-full items-center fixed z-50 justify-between py-4 px-6 lg:px-[190px] bg-white/95 backdrop-blur-lg shadow-sm">
                <Logo className={"lg:w-[260px]"} />

                <nav className="hidden lg:flex items-center space-x-4">
                    <button className="group relative text-white rounded-l-3xl font-semibold flex items-center gap-3 px-6 py-2 bg-[#6C55F5] backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                        Features
                    </button>
                    <button className="group relative border border-[#6C55F5] font-semibold text-[#6C55F5] flex items-center gap-3 px-6 py-2 backdrop-blur-xl rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                        Contacts
                    </button>
                    <button className="group relative border border-[#6C55F5] font-semibold text-[#6C55F5] flex items-center gap-3 px-6 py-2 backdrop-blur-xl rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                        History
                    </button>
                    <button className="group relative border border-[#6C55F5] rounded-r-3xl text-[#6C55F5] font-semibold flex items-center gap-3 px-6 py-2 backdrop-blur-xl rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30">
                        Docs
                    </button>
                </nav>


                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="hidden lg:flex items-center space-x-4">
                        <button onClick={() => setIsOpen(true)}>
                            <CustomerCare  />
                        </button>
                        <Clock />
                        <WalletConnection />
                    </div>
                </div>
            </div>


            {isOpen && (
                <ContactModal onClose={onClose} onAddContact={onAddContact} contacts={contacts} />
            )}
        </>
    )
}

export default ChatHeader;
