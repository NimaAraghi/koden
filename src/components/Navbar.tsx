import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import SearchForm from "./SearchForm";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className='flex justify-between items-center gap-4 mx-auto px-5 py-3'>
      <div className='flex gap-4 w-full'>
        <Link className='min-w-[100px]' href='/'>
          <Image src='/logo.png' width={100} height={100} alt='koden logo' />
        </Link>
        <SearchForm className='hidden md:block' />
      </div>
      <div>
        {session ? (
          <div className='flex items-center gap-4'>
            <Button className='block md:hidden' variant='ghost' asChild>
              <Link href='/search'>
                <Search className='size-5' />
              </Link>
            </Button>
            <Button className='hidden md:block' asChild>
              <Link href='/dashboard/posts/create'>Create Post</Link>
            </Button>
            <UserAvatar user={session.user} />
          </div>
        ) : (
          <div className='flex gap-4'>
            <Button variant='ghost' asChild>
              <Link href='login'>Log in</Link>
            </Button>
            <Button variant='default' asChild>
              <Link href='signup'>Create ccount</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
