"use client";

import { toast } from "sonner";
import { UploadButton } from "../lib/utils";
import { useState } from "react";
import ImageRemove from "./ImageRemove";

export default function ImageUpload({
  imageUrl,
  setImageUrl,
}: {
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [fileKey, setFileKey] = useState("");

  return (
    <div className='flex gap-4'>
      {imageUrl && (
        <div>
          <img src={imageUrl} width={100} />
        </div>
      )}
      <div className='flex items-center gap-4'>
        <UploadButton
          appearance={{
            allowedContent: { display: "none" },
            button: { padding: "16px 8px", width: "fit-content" },
          }}
          content={{
            button: `${imageUrl ? "change" : "Add a cover image"}`,
          }}
          endpoint='imageUploader'
          onClientUploadComplete={(res) => {
            // Do something with the response
            setImageUrl(res[0].url);
            setFileKey(res[0].key);
            console.log(res);

            toast.success("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            toast.error(`ERROR! ${error.message}`);
          }}
        />
        {imageUrl && (
          <ImageRemove fileKey={fileKey} setImageUrl={setImageUrl} />
        )}
      </div>
    </div>
  );
}
