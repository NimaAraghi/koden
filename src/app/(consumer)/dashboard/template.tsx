import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export default function CreatorTemplate({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='flex flex-col md:flex-row max-w-6xl mx-auto'>
      <div className='flex flex-row md:flex-col'>
        <Button variant='ghost' asChild>
          <Link href='/profile'>Profile</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/posts'>Posts</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/posts'>Fuck</Link>
        </Button>
      </div>
      <div className='w-full'>{children}</div>
    </div>
  );
}
