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
// Este componente é a barra de navegação lateral (Navbar) do aplicativo, que fornece links para as principais seções do portal de investimentos. Ele utiliza os componentes de layout e estilo do Sidebar para criar uma estrutura de navegação consistente e responsiva. O Navbar inclui um logotipo no topo, seguido por uma lista de itens de navegação que levam a diferentes páginas do portal, como o dashboard, as carteiras de ativos e o histórico de transações. Cada item de navegação é destacado quando ativo, proporcionando uma experiência visual clara para os usuários. Na parte inferior da barra lateral, há um botão para sair da conta e um botão para alternar entre os modos claro e escuro do aplicativo. O Navbar é essencial para garantir que os usuários possam navegar facilmente pelas diferentes seções do portal de investimentos, proporcionando uma experiência de usuário intuitiva e eficiente.
interface NavItemProps {
  href: string;
  label: string;
  assetType?: TAssetType;
  icon: LucideIcon;
}
// Esta constante define as opções de itens de navegação (navItemOptions) para a barra lateral, incluindo o link de destino (href), o rótulo exibido (label), o tipo de ativo associado (assetType) e o ícone correspondente (icon) para cada item. Ela é utilizada para gerar dinamicamente os itens de navegação na barra lateral, permitindo que os usuários acessem facilmente as diferentes seções do portal de investimentos. Cada item de navegação é configurado com um link específico, um rótulo descritivo, um tipo de ativo opcional para filtrar as informações exibidas e um ícone visual para melhorar a experiência do usuário. O navItemOptions é essencial para garantir que a barra lateral seja flexível e fácil de manter, permitindo que novos itens de navegação sejam adicionados ou modificados de forma eficiente conforme necessário.
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
] as const;
// Esta função é um componente React que representa a barra de navegação lateral (Navbar) do portal de investimentos. Ela utiliza os hooks usePathname, useSearchParams e useRouter do Next.js para gerenciar a navegação e o estado da URL, e o hook useAsset para acessar o contexto de ativos. O Navbar renderiza uma estrutura de navegação usando os componentes do Sidebar, incluindo um logotipo, uma lista de itens de navegação gerados a partir das opções definidas em navItemOptions, e botões para sair da conta e alternar o tema. A função handleRouteChange é responsável por atualizar o tipo de ativo selecionado no contexto quando um item de navegação relacionado a um ativo é clicado, garantindo que as informações exibidas sejam consistentes com a seleção do usuário. O Navbar é essencial para fornecer uma interface de navegação intuitiva e eficiente para os usuários do portal de investimentos. Ele garante que os usuários possam acessar facilmente as diferentes seções do portal e personalizar a experiência de acordo com suas preferências de tema. O Navbar é um componente central para a usabilidade do aplicativo, facilitando a navegação e melhorando a experiência geral do usuário.
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
    } else {
      setCurrentAssetType(null);
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
