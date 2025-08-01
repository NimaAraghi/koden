import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-7xl mx-auto px-[5%] sm:px-2 xl:px-8 my-9",
        className
      )}
    >
      {children}
    </div>
  );
}
