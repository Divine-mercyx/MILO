/*
/// Module: milo_nft
module milo_nft::milo_nft;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module milo_nft::nft_module {
    use std::string::String;
    use sui::object;
    use sui::tx_context;
    use sui::transfer;



    public struct MiloNFT has key, store {
        id: UID,
        name: String,
        description: String,
        creator: address,
        // url: String,
    }

    public entry fun mint(
        name: String,
        description: String,
        // url: string::String,
        ctx: &mut TxContext
    ) {
        let nft = MiloNFT {
            id: object::new(ctx),
            name,
            description,
            creator: tx_context::sender(ctx),
            // url,
        };
        transfer::transfer(nft, tx_context::sender(ctx));
    }

    public entry fun transfer_nft(nft: MiloNFT, recipient: address) {
        transfer::transfer(nft, recipient);
    }
}
