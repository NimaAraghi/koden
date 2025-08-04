import { ForwardRefEditor } from "@/features/posts/components/ForwardRefEditor";
import React from "react";

export default function Test() {
  return (
    <div className='px-8'>
      <div className='bg-white w-80'>
        <ForwardRefEditor markdown='# Write your post Content here' />
      </div>
    </div>
  );
}
