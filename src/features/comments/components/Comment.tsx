import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import { formatter } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    image: string | null;
  };
}

export default function Comment({ comment }: { comment: Comment }) {
  return (
    <div className='flex gap-2'>
      <Avatar className='size-8 py-4'>
        <AvatarImage src={comment.user.image || ""} />
        <AvatarFallback>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <div className='p-4'>
        <p>
          {comment.user.name}
          <span className='text-gray-500'>
            {" "}
            | {formatter.format(comment.createdAt)}
          </span>
        </p>
      </div>
      <p>{comment.content}</p>
    </div>
  );
}
