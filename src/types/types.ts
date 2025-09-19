export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export interface Contact {
    name: string;
    address: string;
}
