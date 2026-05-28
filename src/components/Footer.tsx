import { GitFork } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-5 flex flex-col items-center gap-3">
        <p className="text-xs text-muted-foreground tracking-wide uppercase">
          Desenvolvido por
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="https://github.com/DanielMoraesTI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <GitFork className="w-4 h-4 transition-transform group-hover:scale-110" />
            Daniel Moraes
          </Link>

          <Link
            href="https://github.com/devgabrielpanta"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <GitFork className="w-4 h-4 transition-transform group-hover:scale-110" />
            Gabriel Panta
          </Link>
        </div>
        <Separator className="w-24 mt-1" />
        <p className="text-xs text-muted-foreground">
          © 2026 Finance Investments - UpSkill - Faculdade de Ciências da Universidade de Lisboa
        </p>
      </div>
    </footer>
  );
}
