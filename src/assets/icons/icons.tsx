import React from "react";


export const CornerArc: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="43" height="44" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M5.5874 6.83228C15.9463 -3.88145 42.2193 1.20793 42.2193 1.20793C42.2193 1.20793 16.6754 0.411456 7.71933 11.2079C-0.479337 21.0914 2.71933 43.7079 2.71933 43.7079C2.71933 43.7079 -5.00716 17.7897 5.5874 6.83228Z" fill="#7062FF"/>
    </svg>
);

export const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="16" width="52" height="40" rx="8" fill="#6C55F5"/>
        <rect x="24" y="24" width="36" height="24" rx="4" fill="#FFC107"/>
        <circle cx="54" cy="24" r="3" fill="#6C55F5"/>
    </svg>
);

export const MultiLingualIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00098 12.0001H4.00098M6.00098 12.0001H8.00098M12.001 2.00006V4.00006M12.001 6.00006V8.00006M12 22V10c0-4.4183 3.5817-8 8-8s8 3.5817 8 8-3.5817 8-8 8h-2" stroke="#6C55F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
);

export const SwapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10H4M4 10L9 5M4 10L9 15M4 14H20M20 14L15 9M20 14L15 19" stroke="#6C55F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
);

export const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="#6C55F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
);

export const NFTIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#6C55F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 7L12 12L22 7" stroke="#6C55F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 22V12" stroke="#6C55F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`relative ${className}`}>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0L61.2257 38.7743L100 50L61.2257 61.2257L50 100L38.7743 61.2257L0 50L38.7743 38.7743L50 0Z" fill="#6C55F5"/>
        </svg>
        <div className="absolute top-1/2 left-[-50px] w-20 h-1.5 bg-green-400 rounded-full -translate-y-1"></div>
        <div className="absolute top-1/2 left-[-40px] w-16 h-1.5 bg-red-400 rounded-full translate-y-2"></div>
        <div className="absolute top-1/2 left-[-60px] w-24 h-1.5 bg-blue-400 rounded-full -translate-y-4"></div>
    </div>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
);

export const SocialIcon: React.FC<{ path: string }> = ({ path }) => (
    <a href="#" className="text-white/70 hover:text-white transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d={path} clipRule="evenodd" /></svg>
    </a>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

export const OoiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
);

export const TelegramIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4L22 2z"></path>
    </svg>
);
