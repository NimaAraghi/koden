"use client";

import { NotebookText, User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className='flex flex-row md:flex-col md:w-60'>
      <Button
        className='justify-start'
        variant={pathname === "/dashboard" ? "outline" : "ghost"}
        asChild
      >
        <Link href='/dashboard'>
          <User className='size-5' />
          Profile
        </Link>
      </Button>
      <Button
        className='justify-start'
        variant={pathname === "/dashboard/posts" ? "outline" : "ghost"}
        asChild
      >
        <Link href='/dashboard/posts'>
          <NotebookText className='size-5' />
          Posts
        </Link>
      </Button>
    </div>
  );
}
