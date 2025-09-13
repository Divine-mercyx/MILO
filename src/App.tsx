import './App.css'
import Website from "./pages/Website.tsx";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Header from "./components/layout/Header.tsx";


function App() {
    const currentAccount = useCurrentAccount();

    if (!currentAccount) {
        return (
            <Website />
        );
    } else {
        return (
            <>
                <Header />
            </>
        );
    }
}

export default App
