"use client";
import Image from "next/image";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export default function Header() {
  const { open } = useSidebar();

  return (
    <header
      className={`bg-sidebar flex flex-row justify-between items-center gap-2 w-full border-b p-2
        ${open ? "md:flex-row md:justify-start" : "md:flex-row-reverse"}`}
    >
      <div className={`block ${open ? "md:hidden" : "md:block"}`}>
        <Image
          src="/logo-black.png"
          alt="Finance Investments"
          width={441}
          height={140}
          className={`w-30 h-auto dark:hidden`}
          sizes="120px"
        />
        <Image
          src="/logo-white.png"
          alt="Finance Investments"
          width={441}
          height={140}
          className={`hidden w-30 h-auto dark:block`}
          sizes="120px"
        />
      </div>
      <SidebarTrigger className="" />
    </header>
  );
}
