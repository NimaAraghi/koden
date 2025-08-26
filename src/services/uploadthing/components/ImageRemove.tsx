"use client";

import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction, useTransition } from "react";
import { deleteImage } from "../actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

export default function ImageRemove({
  fileKey,
  setImageUrl,
}: {
  fileKey: string;
  setImageUrl: Dispatch<SetStateAction<string>>;
}) {
  const [isLoading, startTransition] = useTransition();

  function deleteHandler() {
    startTransition(async () => {
      try {
        const { error, message } = await deleteImage(fileKey);

        if (error) toast.error(message);

        toast.success("Image removed");
        setImageUrl("");
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
      }
    });
  }

  return (
    <Button type='button' onClick={deleteHandler} variant='destructive'>
      <div className='grid items-center justify-items-center'>
        <div
          className={cn(
            "col-start-1 col-end-2 row-start-1 row-end-2",
            isLoading ? "invisible" : "visible"
          )}
        >
          Remove
        </div>
        <div
          className={cn(
            "col-start-1 col-end-2 row-start-1 row-end-2 text-center",
            isLoading ? "visible" : "invisible"
          )}
        >
          <Loader2Icon className='animate-spin' />
        </div>
      </div>
    </Button>
  );
}
