"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Building2,
  HandCoins,
  History,
  Wallet,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/mode/theme-toggle-button";
import { usePathname, useSearchParams } from "next/navigation";

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
    href: "/portal/carteira?asset=acoes",
    label: "Ações",
    icon: Wallet,
  },
  {
    href: "/portal/carteira?asset=fundos-imobiliarios",
    label: "Fundos Imobiliários",
    icon: Building2,
  },
  {
    href: "/portal/carteira?asset=renda-fixa",
    label: "Renda Fixa",
    icon: HandCoins,
  },
  {
    href: "/portal/carteira?asset=all",
    label: "Todos os Ativos",
    icon: History,
  },
  {
    href: "/portal/comprar-vender",
    label: "Comprar/Vender",
    icon: HandCoins,
  },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const asset = searchParams.get("asset");

  function RenderedIcon({ icon }: { icon: LucideIcon }) {
    const Icon = icon;
    return <Icon className="w-5 h-5" />;
  }

  console.log("pathname", pathname);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/portal"
          className="relative flex h-50 w-full items-center justify-center overflow-hidden bg-background"
        >
          <Image
            src="/assets/logo-b.png"
            alt="Logo do Sistema de Investimentos"
            fill
            priority
            className="object-cover object-center border-2 border-gray-300"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemOptions.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className={
                      pathname === item.href || (item.href.includes("asset") && asset === item.href.split("=")[1]) ? "bg-primary/20 text-primary" : ""
                    }
                  >
                    <Link
                      href={item.href}
                      className="flex flex-row gap-2 items-center justify-start"
                    >
                      <RenderedIcon icon={item.icon} />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-4">
        <Button variant="outline" size="sm">
          <LogIn className="w-4 h-4" />
          Sair
        </Button>
        <ThemeToggleButton />
      </SidebarFooter>
    </Sidebar>
  );
}
