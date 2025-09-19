import './App.css'
import Website from "./pages/Website.tsx";
import { useCurrentAccount } from "@mysten/dapp-kit";
import ChatHome from "./components/newChat/Chat.tsx";



function App() {
    const currentAccount = useCurrentAccount();


    if (!currentAccount) {
        return (
            <Website />
        );
    } else {
        return (
            <>
                <ChatHome />
            </>
        );
    }
}

export default App
