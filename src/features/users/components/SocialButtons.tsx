import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export function SocialButtons() {
  const onClick = (provider: "github" | "google") => {
    signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className='flex gap-4 w-full'>
      <button
        onClick={() => onClick("github")}
        type='button'
        className='shadow-border rounded-sm w-full flex items-center justify-center p-2'
      >
        <FaGithub className='size-5' />
      </button>
      <button
        onClick={() => onClick("google")}
        type='button'
        className='shadow-border rounded-sm w-full flex items-center justify-center p-2'
      >
        <FaGoogle className='size-5' />
      </button>
    </div>
  );
}
