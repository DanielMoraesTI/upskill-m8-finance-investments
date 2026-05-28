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
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItemProps[] = [
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

//Componente Logo reutilizável para evitar repetição entre desktop e mobile da navegação
const LogoComponent = () => (
  <Link
    href="/portal"
    className="flex min-h-12 items-center justify-center rounded-xl px-3"
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
);

// Componente de item de navegação reutilizável para evitar repetição entre desktop e mobile da navegação
const NavItemComponent = ({
  item,
  pathname,
  isMobile = false,
}: {
  item: NavItemProps;
  pathname: string;
  isMobile?: boolean;
}) => {
  const isActive = pathname === item.href;
  const Icon = item.icon;

  const baseStyles = `flex items-center gap-3 rounded-xl px-3 transition-all ${
    isMobile ? "py-2.5" : "min-h-12 w-full"
  }`;

  const activeStyles = isActive
    ? "bg-cyan-50 text-cyan-950 shadow-sm ring-1 ring-cyan-200"
    : "text-foreground/80 hover:bg-accent/70 hover:text-foreground";

  return (
    <Link href={item.href} className={`${baseStyles} ${activeStyles}`}>
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

//Componente de lista de navegação reutilizável para evitar repetição entre desktop e mobile da navegação
const NavList = ({ isMobile = false }: { isMobile?: boolean }) => {
  const pathname = usePathname();

  return (
    <nav
      className={`flex w-full flex-col gap-2 ${
        isMobile ? "text-base font-medium" : "px-3 py-4"
      }`}
    >
      {navItems.map((item) => (
        <NavItemComponent
          key={item.href}
          item={item}
          pathname={pathname}
          isMobile={isMobile}
        />
      ))}
    </nav>
  );
};

//Barra de navegação desktop (sidebar) visível apenas em telas maiores que sm
const DesktopNavBar = () => (
  <aside className="hidden w-60 shrink-0 border-r border-border bg-background md:sticky md:top-0 md:flex md:h-screen md:flex-col">
    <LogoComponent />
    <NavList />
  </aside>
);

//Barra de navegação mobile (com drawer) visível apenas em telas menores que md
const MobileNavBar = () => (
  <header className="sticky top-0 z-30 flex h-14 items-center justify-start gap-3 border-b bg-background px-3 md:hidden">
    <Sheet>
      <SheetTrigger
        render={(triggerProps) => (
          <Button
            {...triggerProps}
            size="icon"
            variant="outline"
            className="shrink-0"
          >
            <PanelBottom className="h-5 w-5" />
            <span className="sr-only">Abrir / Fechar Menu</span>
          </Button>
        )}
      />

      <SheetContent side="left" className="w-full md:max-w-xs">
        <div className="flex h-full flex-col">
          <LogoComponent />
          <NavList isMobile />
        </div>
      </SheetContent>
    </Sheet>

    <h2 className="text-base font-medium leading-none">Menu</h2>
  </header>
);

//Componente principal de navegação que combina a barra de navegação desktop e mobile, garantindo que apenas uma seja exibida com base no tamanho da tela
export function Navbar() {
  return (
    <>
      <DesktopNavBar />
      <MobileNavBar />
    </>
  );
}
