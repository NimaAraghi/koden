import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchForm({ className }: { className?: string }) {
  return (
    <form className={cn("max-w-2xl w-full", className)} action='/search'>
      <div className='relative'>
        <Input
          className='w-full pl-10'
          type='search'
          name='q'
          placeholder='Search...'
        />
        <Button
          type='submit'
          variant='ghost'
          className='absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer'
        >
          <Search />
        </Button>
      </div>
    </form>
  );
}
