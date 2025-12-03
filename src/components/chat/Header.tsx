import React, { useState } from 'react';
import {CustomerCare, Logo} from "../../assets/icons/icons.tsx";
import {WalletConnection} from "../landing/WalletConnection.tsx";
import ContactModal from "../chatTest/ContactModal.tsx";
import type { Contact } from '../../types/types.ts';
import { Plus } from 'lucide-react';

interface ChatHeaderProps {
    addContact: (contact: Contact) => void;
    contacts: Contact[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ addContact, contacts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-white border-b border-gray-200 w-full">
            <header className="py-4 px-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Logo className={'text-blue-600'} />
                    {/* <h1 className="text-xl font-bold text-gray-900">Milo</h1> */}
                </div>

                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-1 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                    >
                        <Plus size={16} />
                        <span>Add Contact</span>
                    </button>
                    <div className="text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
                        <CustomerCare />
                    </div>
                    <WalletConnection />
                </div>
            </header>

            {isModalOpen && (
                <ContactModal
                    onClose={() => setIsModalOpen(false)}
                    onAddContact={addContact}
                    contacts={contacts}
                />
            )}
        </div>
    );
};

export default ChatHeader;