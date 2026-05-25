"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import NavItem, { NavItemInterface } from "../NavItem";
import "./index.css";

export default function Navbar() {
  const items: NavItemInterface[] = [
    {
      url: "/",
      label: "Dashboard",
    },
    {
      url: "/acoes",
      label: "Ações",
    },
    {
      url: "/fundos-imobiliarios",
      label: "Fundos Imobiliários",
    },
    {
      url: "/renda-fixa",
      label: "Renda Fixa",
    },
    {
      url: "/historico",
      label: "Histórico",
    },
  ];

  const pathname = usePathname();

  return (
    <header>
      <nav className="navbar">
        <Link href="/" className="logo-link">
          <Image
            src="/assets/logo.png"
            alt="Logo do Sistema de Investimentos"
            className="logo"
            width={1224}
            height={768}
            sizes="(max-width: 768px) 112px, 160px"
            priority
          />
        </Link>
        <ul className="navbar-itens">
          {items.map((item, index) => (
            <NavItem
				key={index}
				url={item.url}
				label={item.label}
				isActive={pathname === item.url}
			/>
          ))}
        </ul>

        <button className="btn-contact">Contatar</button>
      </nav>
    </header>
  );
}
