import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const RPC_ENDPOINT =
  import.meta.env.VITE_SUI_RPC_URL || 
  process.env.NEXT_PUBLIC_SUI_RPC_URL || 
  getFullnodeUrl("testnet"); 

export const suiClient = new SuiClient({ url: RPC_ENDPOINT });
