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
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { TAssetType } from "@/schemas/assetSchema";
import { useAsset } from "@/context/AssetProvider";

interface NavItemProps {
  href: string;
  label: string;
  assetType?: TAssetType;
  icon: LucideIcon;
}

const navItemOptions: NavItemProps[] = [
  {
    href: "/portal",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/portal/carteira?asset=acao",
    label: "Ações",
    assetType: {
      id: 1,
      asset_type: "Ação",
    },
    icon: Wallet,
  },
  {
    href: "/portal/carteira?asset=fii",
    label: "Fundos Imobiliários",
    assetType: {
      id: 2,
      asset_type: "FII",
    },
    icon: Building2,
  },
  {
    href: "/portal/carteira?asset=renda-fixa",
    label: "Renda Fixa",
    assetType: {
      id: 3,
      asset_type: "Renda Fixa",
    },
    icon: Landmark,
  },
  {
    href: "/portal/transaction",
    label: "Histórico de Transações",
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
  const router = useRouter();
  const { setCurrentAssetType } = useAsset();
  const asset = searchParams.get("asset");

  function RenderedIcon({ icon }: { icon: LucideIcon }) {
    const Icon = icon;
    return <Icon className="w-5 h-5" />;
  }

  const handleRouteChange = (navItem: NavItemProps) => {
    if (navItem.href.includes("carteira") && navItem.assetType) {
      setCurrentAssetType(navItem.assetType);
    }
    router.push(navItem.href);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/portal"
          className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-sidebar"
        >
          {/* Glow decorativo atrás do logo */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/8 via-transparent to-transparent" />
          <Image
            src="/assets/logo-b.png"
            alt="Logo do Sistema de Investimentos"
            fill
            priority
            className="object-cover object-center opacity-90"
          />
        </Link>
        {/* Linha divisória com brilho */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-sidebar-border to-transparent" />
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItemOptions.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href.includes("asset") &&
                    asset === item.href.split("=")[1]);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      onClick={() => handleRouteChange(item)}
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm rounded-xl px-3 py-2.5 flex flex-row gap-3 items-center"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl transition-all duration-150 px-3 py-2.5 flex flex-row gap-3 items-center"
                      }
                    >
                      <RenderedIcon icon={item.icon} />
                      <span className="text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-accent-foreground/80" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4 gap-2">
        {/* Linha divisória */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-sidebar-border to-transparent mb-1" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span className="text-sm">Sair</span>
        </Button>
        <ThemeToggleButton />
      </SidebarFooter>
    </Sidebar>
  );
}
