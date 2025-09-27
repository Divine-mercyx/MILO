import './App.css'
import Website from "./pages/Website.tsx";
import { useCurrentAccount } from "@mysten/dapp-kit";
import ChatHome from "./components/newChat/Chat.tsx";
import {Toaster} from "react-hot-toast";



function App() {
    const currentAccount = useCurrentAccount();


    if (!currentAccount) {
        return (
            <>
                <Website />
                <Toaster position="top-right" reverseOrder={false} />
            </>
        );
    } else {
        return (
            <>
                <ChatHome />
                <Toaster position="top-right" reverseOrder={false} />
            </>
        );
    }
}

export default App
