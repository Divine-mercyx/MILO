import React, { useState, useRef, useEffect } from 'react';

interface Bank {
    id: string;
    name: string;
    code?: string;
}

interface BankAccountInputProps {
    onBankChange?: (bank: Bank | null) => void;
    onAccountNumberChange?: (accountNumber: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const BankAccountInput: React.FC<BankAccountInputProps> = ({
                                                               onBankChange,
                                                               onAccountNumberChange,
                                                               placeholder = "Enter account number",
                                                               disabled = false,
                                                               className = ""
                                                           }) => {
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sample banks - replace with your actual bank data
    const banks: Bank[] = [
        { id: "1", name: "Chase Bank", code: "CHASE" },
        { id: "2", name: "Bank of America", code: "BOA" },
        { id: "3", name: "Wells Fargo", code: "WF" },
        { id: "4", name: "Citibank", code: "CITI" },
        { id: "5", name: "Capital One", code: "CAP1" },
        { id: "6", name: "TD Bank", code: "TD" },
        { id: "7", name: "PNC Bank", code: "PNC" },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBankSelect = (bank: Bank) => {
        setSelectedBank(bank);
        setIsDropdownOpen(false);
        onBankChange?.(bank);
    };

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAccountNumber(value);
        onAccountNumberChange?.(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className={`relative w-full  ${className}`} ref={dropdownRef}>
            <div className="flex w-full bg-white border-2 border-[#7062FF] rounded-2xl overflow-hidden focus-within:border-[#7062FF] transition-colors duration-200">
                {/* Bank Selector Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={disabled}
                        onKeyDown={handleKeyDown}
                        className={`
              flex items-center justify-between px-6 py-4 bg-white text-[#7062FF]
              border-r-2 border-[#7062FF] font-medium text-base
              transition-colors duration-200 min-w-[180px]
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                    >
            <span className="truncate">
              {selectedBank ? selectedBank.name : 'Choose bank'}
            </span>
                        <svg
                            className={`w-5 h-5 ml-3 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#7062FF] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                            {banks.map((bank) => (
                                <button
                                    key={bank.id}
                                    type="button"
                                    onClick={() => handleBankSelect(bank)}
                                    className={`
                    w-full px-6 py-3 text-left hover:bg-purple-50 focus:bg-purple-50 
                    focus:outline-none transition-colors duration-150 text-gray-700
                    ${selectedBank?.id === bank.id ? 'bg-purple-100 text-purple-700' : ''}
                  `}
                                    role="option"
                                    aria-selected={selectedBank?.id === bank.id}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{bank.name}</span>
                                        {bank.code && (
                                            <span className="text-sm text-gray-500">{bank.code}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Account Number Input */}
                <input
                    type="text"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                    flex-1 px-6 py-4 text-[#7062FF] placeholder-[#7062FF] bg-white
                    focus:outline-none text-base font-medium
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/*/!* Optional: Display selected values for demo *!/*/}
            {/*{(selectedBank || accountNumber) && (*/}
            {/*    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">*/}
            {/*        <div className="space-y-1">*/}
            {/*            {selectedBank && (*/}
            {/*                <div>*/}
            {/*                    <strong>Selected Bank:</strong> {selectedBank.name}*/}
            {/*                    {selectedBank.code && <span className="text-gray-500"> ({selectedBank.code})</span>}*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*            {accountNumber && (*/}
            {/*                <div><strong>Account Number:</strong> {accountNumber}</div>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

// Example usage component
const BankAccountExample: React.FC = () => {
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [accountNumber, setAccountNumber] = useState<string>("");

    console.log(selectedBank);
    console.log(accountNumber);

    const handleBankChange = (bank: Bank | null) => {
        setSelectedBank(bank);
        console.log('Bank selected:', bank);
    };

    const handleAccountNumberChange = (number: string) => {
        setAccountNumber(number);
        console.log('Account number:', number);
    };

    return (
        <BankAccountInput
            onBankChange={handleBankChange}
            onAccountNumberChange={handleAccountNumberChange}
            placeholder="Enter account number"
        />
    );
};

export default BankAccountExample;
