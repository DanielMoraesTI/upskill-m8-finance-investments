import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full border-b bg-background/70">
      <div className="relative h-24 w-full bg-background">
        <Image
          src="/assets/Logo-horizontal.png"
          alt="Finance Investments"
          fill
          priority
          sizes="100vw"
          className="object-contain object-center"
        />
      </div>
    </header>
  );
}
