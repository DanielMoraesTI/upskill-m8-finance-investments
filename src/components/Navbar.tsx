"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Building2,
  HandCoins,
  History,
  PanelBottom,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
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

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 border-r border-border bg-background sm:flex sm:flex-col">
        <nav className="flex w-full flex-col gap-2 px-3 py-4">
          <Link
            href="/portal"
            className="mb-4 flex min-h-12 items-center justify-center rounded-xl px-3"
          >
            <Image
              src="/assets/logo.png"
              alt="Logo do Sistema de Investimentos"
              width={1224}
              height={768}
              sizes="(max-width: 768px) 112px, 160px"
              priority
              style={{ width: "auto", height: "auto" }}
            />
            <span className="sr-only">Logo da Empresa</span>
          </Link>
          {navItems.map((item) => {
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
          })}
        </nav>
      </aside>

      <div className="sm:hidden flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-start gap-3 border-b bg-background px-3">
          <Sheet>
            <SheetTrigger
              render={
                <Button size="icon" variant="outline" className="shrink-0" />
              }
            >
              <PanelBottom className="h-5 w-5" />
              <span className="sr-only">Abrir / Fechar Menu</span>
            </SheetTrigger>
            
            <SheetContent side="left" className="sm:max-w-x">
              <nav className="flex h-full flex-col gap-2 text-base font-medium">
                <Link
                  href="/portal"
                  className="mx-auto mt-4 flex h-14 items-center justify-center"
                >
                  <Image
                    src="/assets/logo.png"
                    alt="Logo do Sistema de Investimentos"
                    width={1224}
                    height={768}
                    sizes="(max-width: 768px) 112px, 160px"
                    priority
                    style={{ width: "auto", height: "auto" }}
                  />
                  <span className="sr-only">Logo da Empresa</span>
                </Link>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                        isActive
                          ? "bg-cyan-50 text-cyan-950 shadow-sm ring-1 ring-cyan-200"
                          : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
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
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <h2 className="text-base font-medium leading-none">Menu</h2>
        </header>
      </div>
    </div>
  );
}
