"use client";

import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction } from "react";
import { deleteImage } from "../actions";
import { toast } from "sonner";

export default function ImageRemove({
  fileKey,
  setImageUrl,
}: {
  fileKey: string;
  setImageUrl: Dispatch<SetStateAction<string>>;
}) {
  const deleteHandler = async () => {
    try {
      const { error, message } = await deleteImage(fileKey);

      if (error) toast.error(message);

      toast.success("Image removed");
      setImageUrl("");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  return (
    <Button onClick={deleteHandler} variant='destructive'>
      Remove
    </Button>
  );
}
