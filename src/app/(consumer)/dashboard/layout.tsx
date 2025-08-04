import DashboardSidebar from "@/components/DashboardSidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='bg-gray-100'>
      <div className='flex flex-col md:flex-row max-w-[1350px] mx-auto'>
        <DashboardSidebar />
        <div className='w-full'>{children}</div>
      </div>
    </div>
  );
}
