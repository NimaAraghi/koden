"use client";

import { toast } from "sonner";
import { UploadButton } from "../lib/utils";
import { useState } from "react";
import Image from "next/image";

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div>
      <UploadButton
        endpoint='imageUploader'
        onClientUploadComplete={(res) => {
          // Do something with the response
          setImageUrl(res[0].url);
          console.log(res);

          toast.success("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error(`ERROR! ${error.message}`);
        }}
      />

      {imageUrl ? (
        <div>
          <Image src={imageUrl} width={300} height={300} alt=''></Image>
        </div>
      ) : null}
    </div>
  );
}
