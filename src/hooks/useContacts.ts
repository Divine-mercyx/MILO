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
        return found ? found.address : nameOrAddress; // fallback: assume it's already an address
      };
    
      return { contacts, addContact, listContacts, resolveContact };
    }