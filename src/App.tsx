import './App.css'
import Website from "./pages/Website.tsx";
import { useCurrentAccount } from "@mysten/dapp-kit";


function App() {
    const currentAccount = useCurrentAccount();

    if (!currentAccount) {
        return (
            <Website />
        );
    } else {
        return (
            <>
            </>
        );
    }
}

export default App
