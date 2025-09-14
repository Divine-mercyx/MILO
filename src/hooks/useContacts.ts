import { useState, useEffect } from "react";

export type Contact = {
    name: string;
    address: string;
};

const STORAGE_KEY = "contacts";

export function useContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setContacts(JSON.parse(saved));
    }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }, [contacts]);

    const addContact = (newContact: Contact) => {
        setContacts((prev) => [...prev, newContact]);
    };

    const listContacts = () => contacts;

    const resolveContact = (nameOrAddress: string): string => {
        const found = contacts.find(
            (c) => c.name.toLowerCase() === nameOrAddress.toLowerCase()
        );
        if (found) {
            return found.address;
        }
        // Basic check if it looks like a Sui address (starts with 0x and is long enough)
        if (nameOrAddress.startsWith('0x') && nameOrAddress.length > 10) {
            return nameOrAddress;
        }
        // If it's not a saved contact and doesn't look like an address, throw an error.
        // Your AI should catch this first, but this is a good safety net.
        throw new Error(`"${nameOrAddress}" is not a saved contact and does not appear to be a valid Sui address.`);
    };

      return { contacts, addContact, listContacts, resolveContact };
    }
