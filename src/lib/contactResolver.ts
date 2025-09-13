const contacts: { [name: string]: string } = {
  Maria: "0xReceiver123...",
  John: "0xAnotherWallet456...",
};

export function resolveContact(nameOrAddress: string): string {
  const key = Object.keys(contacts).find(
    (c) => c.toLowerCase() === nameOrAddress.toLowerCase()
  );
  return key ? contacts[key] : nameOrAddress; // fallback: assume it's already an address
}

export function addContact(name: string, address: string) {
  contacts[name] = address;
}

export function listContacts() {
  return contacts;
}
