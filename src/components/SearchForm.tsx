"use client";

import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SearchForm({ className }: { className?: string }) {
  return (
    <form className={cn("max-w-2xl w-full", className)} action='/search'>
      <div className='relative'>
        <Suspense>
          <SuspendedComponent />
        </Suspense>
        <Button
          type='submit'
          variant='link'
          className='absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer'
        >
          <Search />
        </Button>
      </div>
    </form>
  );
}

function SuspendedComponent() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";

  return (
    <input
      className='w-full pl-10 py-1.5 pr-3 rounded-md outline-0 border-2 border-black appearance-none'
      type='search'
      name='q'
      defaultValue={query}
      placeholder='Search...'
    />
  );
}
