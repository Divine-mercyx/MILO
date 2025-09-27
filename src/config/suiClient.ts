import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const RPC_ENDPOINT =
    getFullnodeUrl("testnet");

export const suiClient = new SuiClient({ url: RPC_ENDPOINT });
