"use client";

import { useState } from "react";
import {
  BarChart3,
  Building2,
  HandCoins,
  History,
  PanelBottom,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItemOptions: NavItemProps[] = [
  {
    href: "/portal",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/portal/acoes",
    label: "Ações",
    icon: Wallet,
  },
  {
    href: "/portal/fundos-imobiliarios",
    label: "Fundos Imobiliários",
    icon: Building2,
  },
  {
    href: "/portal/renda-fixa",
    label: "Renda Fixa",
    icon: HandCoins,
  },
  {
    href: "/portal/historico",
    label: "Histórico",
    icon: History,
  },
] as const;

export default function Header() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const pathname = usePathname();

  const NavList = () => {
    return (
      <ul className="flex flex-col gap-2 px-3 py-4">
        {navItemOptions.map((item) => (
          <NavItems key={item.href} {...item} />
        ))}
      </ul>
    );
  };

  const NavItems = (item: NavItemProps) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all ${
          isActive
            ? "bg-cyan-50 text-cyan-950 shadow-sm ring-1 ring-cyan-200"
            : "text-foreground/80 hover:bg-accent/70 hover:text-foreground"
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
            isActive
              ? "bg-cyan-600 text-white"
              : "bg-muted/60 text-muted-foreground"
          }`}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <header className="bg-blue-500 w-full md:w-50 lg:w-70 h-18 md:h-screen">
        <button
          className="md:hidden"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <PanelBottom className="h-5 w-5" />
        </button>
        Logo Hamburguer
        <nav className="hidden md:block">
          <NavList />
        </nav>
      </header>

      {/** MOBILE SIDEBAR */}
      {openSidebar && (
        <div className="fixed top-0 left-0 w-screen h-screen">
          {/** OVERLAY */}
          <div
            className="bg-black/50 w-full h-full z-10"
            onClick={() => setOpenSidebar(false)}
          ></div>

          {/** SIDEBAR */}
          <div className="absolute top-0 left-0 bg-background w-[75%] h-full z-30">
            LOGO
            <NavList />
            <div className=""></div>
            <button className="bg-green-500">Logout</button>
            <button className="bg-green-500">Light/Dark</button>
          </div>
        </div>
      )}
    </>
  );
}
