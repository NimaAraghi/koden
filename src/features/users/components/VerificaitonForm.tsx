"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type VerificationFormProps = {
  code: string;
  setCode: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
};

export function VerificationForm({
  code,
  setCode,
  onSubmit,
  loading = false,
  title = "Verify your email",
  description = "Please enter the verification code sent to your email.",
  buttonText = "Verify",
}: VerificationFormProps) {
  return (
    <div className='w-xs p-5 bg-white rounded-lg shadow-md flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>{title}</h2>
      <p className='text-sm'>{description}</p>
      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        <Input
          type='text'
          placeholder='Enter verification code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className='shadow-border'
        />
        <Button
          type='submit'
          disabled={loading}
          className='bg-pink hover:bg-pink/90'
        >
          {loading ? "Verifying..." : buttonText}
        </Button>
      </form>
    </div>
  );
}
