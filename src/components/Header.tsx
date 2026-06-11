"use client";
import Image from "next/image";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import InvestorProfileSlider from "@/components/chart-objects/InvestorProfileSlider";

export default function Header() {
  const { open } = useSidebar();

  return (
    <header className="bg-sidebar flex flex-row items-center gap-2 w-full border-b p-2">

      <SidebarTrigger />

      <div className={`ml-auto ${open ? "hidden" : "block"}`}>
        <Image
          src="/logo-black.png"
          alt="Finance Investments"
          width={441}
          height={140}
          className="w-30 h-auto dark:hidden"
          sizes="120px"
        />
        <Image
          src="/logo-white.png"
          alt="Finance Investments"
          width={441}
          height={140}
          className="hidden w-30 h-auto dark:block"
          sizes="120px"
        />
      </div>

      <div className="flex flex-1 w-full justify-center">
        <InvestorProfileSlider />
      </div>

      <h1 className="text-sm font-medium">Nome de Usuário</h1>

    </header>
  );
}
