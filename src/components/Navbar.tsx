import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import SearchForm from "./SearchForm";
import { Suspense } from "react";

export default async function Navbar() {
  return (
    <header className='flex justify-between items-center gap-4 mx-auto px-5 py-3'>
      <div className='flex items-center gap-4 w-full'>
        <Link className='font-extrabold text-4xl ' href='/'>
          Koden
        </Link>
        <SearchForm className='hidden md:block' />
      </div>
      <div>
        <Suspense
          fallback={
            <div className='flex gap-4'>
              <Button variant='ghost' asChild>
                <Link href='/login'>Log in</Link>
              </Button>
              <Button variant='default' asChild>
                <Link href='/signup'>Create ccount</Link>
              </Button>
            </div>
          }
        >
          <AuthorizedComponent />
        </Suspense>
      </div>
    </header>
  );
}

async function AuthorizedComponent() {
  const session = await auth();

  return (
    <>
      {session ? (
        <div className='flex items-center gap-4'>
          <Button className='block md:hidden' variant='ghost' asChild>
            <Link href='/search'>
              <Search className='size-5' />
            </Link>
          </Button>
          <Button className='hidden md:block' asChild>
            <Link href='/new'>Create Post</Link>
          </Button>
          <UserAvatar user={session.user} />
        </div>
      ) : (
        <div className='flex gap-4'>
          <Button variant='ghost' asChild>
            <Link href='/login'>Log in</Link>
          </Button>
          <Button variant='default' asChild>
            <Link href='/signup'>Create ccount</Link>
          </Button>
        </div>
      )}
    </>
  );
}
