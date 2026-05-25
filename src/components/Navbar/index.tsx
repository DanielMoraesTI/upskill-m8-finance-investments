"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import NavItem, { NavItemInterface } from "../NavItem";
import "./index.css";
import { FaBars, FaXmark } from "react-icons/fa6";
import { useState } from "react";


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

  const [openMenu, setOpenMenu] = useState<boolean>(false);

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
        <ul className={`navbar-itens ${openMenu ? "open" : ""}`}>
          {items.map((item, index) => (
            <NavItem
				key={index}
				url={item.url}
				label={item.label}
				isActive={pathname === item.url}
			/>
          ))}
        </ul>

		<button className="btn-mobile-menu" onClick={() => setOpenMenu(!openMenu)}>
			{openMenu ? <FaXmark /> : <FaBars />}
		</button>

        <button className="btn-contact">Contatar</button>
      </nav>
    </header>
  );
}
