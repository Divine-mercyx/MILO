import './App.css'
import Website from "./pages/Website.tsx";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Header from "./components/chat/Header.tsx";
import Swap from "./components/chat/swap/Swap.tsx";


function App() {
    const currentAccount = useCurrentAccount();

    if (!currentAccount) {
        return (
            <Website />
        );
    } else {
        return (
            <div className="bg-white font-sans text-milo-text overflow-x-hidden relative">
                <div className="relative z-10">
                    <Header />
                </div>
                <Swap />
            </div>
        );
    }
}

export default App
