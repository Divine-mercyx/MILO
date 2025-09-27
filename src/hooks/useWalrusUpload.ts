import { useState } from "react";

const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const WALRUS_PUBLISHER = 'https://publisher.walrus-testnet.walrus.space';

export function getWalrusPreviewUrl(blobId: string): string {
    return `${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`;
}

export function useWalrusUpload() {
    const [uploading, setUploading] = useState(false);

    const uploadToWalrus = async (
        file: File
    ): Promise<{ blobId: string; previewUrl: string } | null> => {
        setUploading(true);
        try {
            //   const formData = new FormData();
            //   formData.append("file", file);
            console.log('file', file);
            const res = await fetch(`${WALRUS_PUBLISHER}/v1/blobs`, {
                method: "PUT",
                body: file,
            });

            if (!res.ok) {
                throw new Error(`Upload failed with status ${res.status}`);
            }

            const data = await res.json();
            console.log('data: ', data);
            const blobId = data.newlyCreated.blobObject.blobId as string;
            const previewUrl = getWalrusPreviewUrl(blobId);

            return { blobId, previewUrl };
        } catch (err) {
            console.error("Data upload error:", err);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadToWalrus, uploading };
}
