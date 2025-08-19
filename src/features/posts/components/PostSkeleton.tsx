import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function PostSkeleton() {
  return (
    <div className='flex flex-col'>
      {new Array(10).fill(null).map((_, index) => (
        <div className='flex flex-col border-b-2 border-gray-200 px-none py-4 md:p-4'>
          <div className='flex items-center gap-2 w-fit'>
            <Skeleton className='size-10 rounded-full' />
            <div>
              <Skeleton className='w-24 h-6 mb-2' />
              <Skeleton className='w-16 h-4' />
            </div>
          </div>
          <div className='flex justify-between items-start p-2'>
            <div className='flex-1'>
              <Skeleton className='w-3/4 h-10 mb-2' />
              <div className='flex flex-wrap gap-2 mt-2'>
                <Skeleton className='w-16 h-8 mb-2 rounded-md' />
                <Skeleton className='w-16 h-8 mb-2 rounded-md' />
                <Skeleton className='w-16 h-8 mb-2 rounded-md' />
                <Skeleton className='w-16 h-8 mb-2 rounded-md' />
              </div>
            </div>
            <Skeleton className='aspect-video w-24 sm:w-32 md:w-40 rounded-xl' />
          </div>
        </div>
      ))}
    </div>
  );
}
