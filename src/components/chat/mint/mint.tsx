import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { NFTStorage, File } from "nft.storage"; 
import { multiaddr } from "@multiformats/multiaddr"; 
import type { Intent } from "../../../lib/suiTxBuilder";

const Mint: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState("");
  const currentAccount = useCurrentAccount();
  const [metadata, setMetadata] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      const client = new NFTStorage({ token: import.meta.env.VITE_NFT_API_KEY });
      const cid = await client.storeBlob(uploadedFile);
      setFileUrl(`https://ipfs.io/ipfs/${cid}`);
    }
  };

  const handleMetadataChange = () => {
    setMetadata(
      JSON.stringify({
        title,
        description,
        creator: currentAccount?.address || "",
      })
    );
  };

  const handleMint = async () => {
    if (!file || !title || !currentAccount?.address || !fileUrl) {
      alert("Please complete all required fields and upload a file.");
      return;
    }

    console.log({ metadata, fileUrl, creator: currentAccount.address });
    alert("Minting NFT... ");
    const intent: Intent = { action: "mint", metadata, assetUrl: fileUrl };
    // const txb = await buildTransaction(intent);
    // await signAndExecuteTransaction({ transaction: txb });
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 min-h-screen bg-gray-50">
      <h1
        style={{ fontFamily: "poppins" }}
        className="text-3xl md:text-[66.55px] font-semibold text-center mb-8 text-transparent bg-gradient-to-r from-[#7062FF] to-[#362F7B] bg-clip-text leading-tight md:leading-[66px]"
      >
        Mint your NFT on <span className="text-[#362F7B]">Sui with MILO</span>
      </h1>
      <div className="w-full max-w-xl space-y-6 bg-white rounded-2xl p-6 shadow-lg">
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
              <Upload size={32} className="text-[#6C55F5]" />
              <span className="mt-2 text-[15.96px]">
                {file ? file.name : "Click to upload image, video, or audio"}
              </span>
            </label>
          </div>
        </div>
        <div className="border border-[#362F7B]/20 rounded-2xl p-6 bg-[#F9F9FF] space-y-4">
          <label className="block text-[#6C55F5] font-medium mb-2 text-[17.7px]">
            Add metadata
          </label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleMetadataChange();
            }}
            className="w-full border border-[#362F7B]/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#6C55F5] text-[#6C55F5] placeholder-[#6C55F5]/50"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              handleMetadataChange();
            }}
            className="w-full border border-[#362F7B]/20 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#6C55F5] text-[#6C55F5] placeholder-[#6C55F5]/50"
          />
          
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Creator address (auto-filled)"
            value={currentAccount?.address || ""}
            readOnly
            className="w-full border border-[#362F7B]/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#6C55F5] text-[#6C55F5] placeholder-[#6C55F5]/50"
          />
        </div>
        <button
          onClick={handleMint}
          className="w-full bg-[#6C55F5] text-white py-3 rounded-full font-semibold text-lg hover:bg-[#362F7B] transition-colors disabled:opacity-50"
          disabled={!file || !title || !currentAccount?.address}
        >
          Mint
        </button>
      </div>
    </div>
  );
};

export default Mint;