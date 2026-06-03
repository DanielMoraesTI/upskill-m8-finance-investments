import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full border-b bg-background/70">
      <div className="relative h-24 w-full bg-background">
        {/*<Image
          src="/assets/Logo-horizontal.png"
          alt="Finance Investments"
          fill
          priority
          sizes="100vw"
          className="object-contain object-center"
        />*/}
        <h1 className="text-2xl font-bold text-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          Nome do Usuário Logado
        </h1>
      </div>
    </header>
  );
}
