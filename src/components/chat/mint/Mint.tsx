import React, { useState } from "react";
import { Upload } from "lucide-react";
import {
    useCurrentAccount,
    useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { buildTransaction, type Intent } from "../../../lib/suiTxBuilder";
import toast from "react-hot-toast";
import {
    useWalrusUpload,
    getWalrusPreviewUrl,
} from "../../../hooks/useWalrusUpload";

const Mint: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [blobId, setBlobId] = useState("");
    const { uploadToWalrus, uploading } = useWalrusUpload();
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecuteTransaction } =
        useSignAndExecuteTransaction();
    const [lastMinted, setLastMinted] = useState<{
        name: string;
        description: string;
        previewUrl: string;
        txDigest: string;
    } | null>(null);
    console.log(uploading);

    // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //   if (e.target.files?.length) {
    //     const uploadedFile = e.target.files[0];
    //     setFile(uploadedFile);

    //     const client = new NFTStorage({ token: import.meta.env.VITE_NFT_API_KEY });
    //     const cid = await client.storeBlob(uploadedFile);
    //     setFileUrl(`https://ipfs.io/ipfs/${cid}`);
    //   }
    // };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const uploadedFile = e.target.files[0];
            setFile(uploadedFile);

            toast.loading("Uploading data...");
            const result = await uploadToWalrus(uploadedFile);
            toast.dismiss();

            if (result) {
                setBlobId(result.blobId);
                setPreviewUrl(result.previewUrl);
                toast.success("Asset uploaded successfully!");
            } else {
                toast.error("Upload failed");
            }
        }
    };

    const handleMint = async () => {
        if (!file) return toast.error("Please upload a file");
        if (!name) return toast.error("Please enter a title");
        if (!description) return toast.error("Please add a description");
        if (!blobId) return toast.error("Upload to data before minting");

        try {
            toast.loading("Minting NFT...");
            const intent: Intent = {
                action: "mint",
                name,
                description,
                blobId,
            };

            console.log("Minting with:", { name, description, blobId });

            const txb = await buildTransaction(intent);
            const result = await signAndExecuteTransaction({
                transaction: txb as any,
            });

            toast.dismiss();
            toast.success(
                <div className="flex flex-col gap-2">
                    <p>✅ NFT Minted!</p>
                    <button
                        onClick={() =>
                            window.open(
                                `https://suiexplorer.com/txblock/${result.digest}?network=testnet`,
                                "_blank"
                            )
                        }
                        className="text-sm text-blue-500 underline"
                    >
                        View on Explorer
                    </button>
                </div>,
                { duration: 10000 }
            );

            setLastMinted({
                name,
                description,
                previewUrl: getWalrusPreviewUrl(blobId),
                txDigest: result.digest,
            });

            setTimeout(() => setLastMinted(null), 30000);

            setFile(null);
            setName("");
            setDescription("");
            setBlobId("");
            setPreviewUrl("");
        } catch (err: any) {
            toast.error(`
        Mint failed: ${err.message}`);
        }
    };
    return (
        <section className="mt-20 relative container mx-auto px-6 py-10 sm:py-32 lg:py-10 lg:text-center">
            <h1 style={{ fontFamily: "poppins" }} className="text-3xl hidden lg:block md:block md:text-[35.55px] font-semibold text-milo-dark-purpl bg-gradient-to-r from-[#7062FF] to-[#362F7B] bg-clip-text text-transparent leading-tight lg:leading-[36px]">
                Mint your NFT on <span className="text-[#362F7B]">Sui with MILO</span>
            </h1>

            <div className="border border-[#362F7B] rounded-2xl p-2 lg:mt-10 max-w-4xl  space-y-2 mx-auto">
                <div className="border border-[#362F7B]/20 rounded-2xl p-6 bg-[#F9F9FF]">
                    <label className="block text-[#6C55F5] font-medium mb-2 text-[17.7px]">
                        Upload your asset
                    </label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#6C55F5]/50 rounded-xl p-6 cursor-pointer transition hover:border-[#6C55F5]">
                        <input
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="assetUpload"
                        />
                        <label
                            htmlFor="assetUpload"
                            className="flex flex-col items-center cursor-pointer text-[#6C55F5] text-center"
                        >
                            <Upload size={32} strokeWidth={2} className="text-[#6C55F5]" />
                            <span className="mt-2 text-[15.96px]">
                {file ? file.name : "Click to upload image, video, or audio"}
              </span>
                        </label>
                    </div>
                    {previewUrl && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Preview:</p>
                            {file?.type.startsWith("image/") ? (
                                <img
                                    src={previewUrl}
                                    alt="Uploaded preview"
                                    className="rounded-lg mt-2 max-h-64"
                                />
                            ) : file?.type.startsWith("video/") ? (
                                <video
                                    src={previewUrl}
                                    controls
                                    className="rounded-lg mt-2 max-h-64"
                                />
                            ) : file?.type.startsWith("audio/") ? (
                                <audio src={previewUrl} controls className="mt-2 w-full" />
                            ) : (
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    Open file
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="border border-[#362F7B]/20 rounded-2xl p-6 bg-[#F9F9FF] space-y-4">
                    <label className="block text-[#6C55F5] font-medium mb-2 text-[17.7px]">
                        Add metadata
                    </label>
                    <input
                        type="text"
                        placeholder="Title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-[#362F7B]/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#6C55F5] text-[#6C55F5]"
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-[#362F7B]/20 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#6C55F5] text-[#6C55F5]"
                    />
                </div>

                <div className="flex gap-4">
                    <input
                        type="text"
                        value={currentAccount?.address || ""}
                        readOnly
                        className="w-full border border-[#362F7B]/20 rounded-lg p-3 text-[#6C55F5]"
                    />
                </div>

                <button
                    onClick={handleMint}
                    className="w-full bg-[#6C55F5] text-white py-3 rounded-full font-semibold text-lg hover:bg-[#362F7B] transition-colors disabled:opacity-50"
                    disabled={!file || !name || !description || !currentAccount?.address}
                >
                    Mint
                </button>
            </div>

            {lastMinted && (
                <div className="mt-8 w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg">
                    <button
                        onClick={() => setLastMinted(null)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                    <h2 className="text-xl font-semibold text-[#362F7B] mb-4">
                        NFT minted successfully
                    </h2>
                    <div className="space-y-3">
                        {lastMinted.previewUrl && (
                            <img
                                src={lastMinted.previewUrl}
                                alt={lastMinted.name}
                                className="rounded-lg max-h-64"
                            />
                        )}
                        <p className="font-medium text-[#6C55F5]">{lastMinted.name}</p>
                        <p className="text-gray-600">{lastMinted.description}</p>
                        <a
                            href={`https://suiscan.xyz/txblock/${lastMinted.txDigest}?network=testnet`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 underline text-sm"
                        >
                            View on Explorer
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Mint;
