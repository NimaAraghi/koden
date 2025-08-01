import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export default function PostFormLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='flex flex-col md:flex-row max-w-6xl mx-auto'>
      <header>is this it?</header>
      <div className='w-full'>{children}</div>
    </div>
  );
}
