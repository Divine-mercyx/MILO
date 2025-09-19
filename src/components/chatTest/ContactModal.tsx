import React, { useState } from 'react';
import { CloseIcon } from '../../assets/icons/icons.tsx';
import type { Contact } from '../../types/types.ts';

interface ContactModalProps {
    onClose: () => void;
    onAddContact: (contact: Contact) => void;
    contacts: Contact[];
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, onAddContact, contacts }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && address.trim()) {
            onAddContact({ name, address });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 id="modal-title" className="text-2xl font-bold text-milo-dark-purple mb-4">Add New Contact</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-milo-purple focus:border-milo-purple sm:text-sm"
                            placeholder="e.g., Alice"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Sui Address</label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-milo-purple focus:border-milo-purple sm:text-sm"
                            placeholder="0x..."
                            required
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-milo-purple hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-milo-purple disabled:opacity-50"
                            disabled={!name.trim() || !address.trim()}
                        >
                            Save Contact
                        </button>
                    </div>
                    {contacts.length > 0 && (
                        contacts.map((contact, index) => (
                            <>
                                <div key={index} className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                    <p className="text-xs text-gray-500 break-all">{contact.address}</p>
                                </div>
                            </>
                        )
                    ))}
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
