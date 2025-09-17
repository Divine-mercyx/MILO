import React from "react";
import type {Contact} from "../../types/types.ts";
import {PlusIcon, CloseIcon, MessageSquareIcon, UserIcon} from "../../assets/icons/icons.tsx";
import img from '../../assets/icons/img_16.png'
import {WalletConnection} from "../landing/WalletConnection.tsx";

const Sidebar: React.FC<{
    contacts: Contact[];
    onAddContact: () => void;
    isOpen: boolean;
    onClose: () => void;
}> = ({ contacts, onAddContact, isOpen, onClose }) => {
    return (
        <>
            <div className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <aside className={`absolute lg:relative z-40 w-72 bg-milo-dark-purple text-white h-full flex flex-col p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between lg:justify-start mb-6">
                    <img src={img} alt="Milo Logo" className="h-8 w-auto" />
                    <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white" aria-label="Close menu">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                {/*<button className="flex items-center justify-center w-full px-4 py-2 bg-milo-purple rounded-lg font-semibold hover:opacity-90 transition-opacity">*/}
                {/*    <PlusIcon className="w-5 h-5 mr-2" />*/}
                {/*    New Chat*/}
                {/*</button>*/}
                <WalletConnection />

                <div className="flex-grow overflow-y-auto mt-6 space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white/50 px-2 mb-2">History</h3>
                        <ul className="space-y-1">
                            <li>
                                <a href="#" className="flex items-center p-2 rounded-lg bg-white/10 text-sm">
                                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                                    <span>SUI token swap question</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 rounded-lg hover:bg-white/10 text-sm text-white/70">
                                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                                    <span>NFT minting process</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white/50 px-2 mb-2">Contacts</h3>
                        <ul className="space-y-1">
                            {contacts.map((contact, index) => (
                                <li key={index} className="flex items-center p-2 text-sm text-white/70">
                                    <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="truncate" title={contact.address}>{contact.name}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={onAddContact} className="flex items-center w-full p-2 mt-2 rounded-lg hover:bg-white/10 text-sm text-white/70">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Contact
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
export default Sidebar;
