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

export default function Shadbar() {
  const pathname = usePathname();

  function RenderedIcon({ icon }: { icon: LucideIcon }) {
    const Icon = icon;
    return <Icon className="w-5 h-5" />;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/portal"
          className="relative flex h-50 w-full items-center justify-center overflow-hidden bg-red-500"
        >
          <Image
            src="/assets/logo.png"
            alt="Logo do Sistema de Investimentos"
            fill
            priority
            className="object-cover object-center"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemOptions.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href}>
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

      <SidebarFooter className="">
        <button className="bg-green-500">Logout</button>
        <button className="bg-green-500">Light/Dark</button>
      </SidebarFooter>
    </Sidebar>
  );
}
