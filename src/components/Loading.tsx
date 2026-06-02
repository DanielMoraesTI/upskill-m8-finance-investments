import Image from "next/image";

export default function Loading() {
  return (
    // Fundo base escuro
    <div className="fixed top-0 left-0 z-50 flex min-h-screen min-w-screen items-center justify-center bg-[#070b14] overflow-hidden">
      {/* EFEITO DE GLOW RADIAL (Técnica do Blur)
        Criamos "bolas" de luz atrás do logo e aplicamos um desfoque extremo.
        Isso funciona nativamente no Tailwind sem risco de quebrar no build.
      */}
      <div className="absolute top-1/2 left-1/2 h-[50vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a2b4c] opacity-60 blur-[120px]"></div>
      <div className="absolute top-1/2 left-1/2 h-[30vh] w-[30vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2dd4bf] opacity-10 blur-[100px]"></div>

      {/* Gradiente linear nos cantos (Classes padrão do Tailwind) */}
      <div className="absolute inset-0 bg-linear-to-tr from-[#070b14] via-transparent to-[#0e2142]/40"></div>

      {/* Overlay tipo Vignette para escurecer as bordas */}
      <div
        className="absolute inset-0 bg-black/10"
        style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.9)" }}
      ></div>

      {/* Container do Ícone: Z-index para ficar acima dos fundos e classe animate-pulse */}
      <div className="relative z-10 flex flex-col items-center animate-pulse drop-shadow-[0_0_20px_rgba(45,212,191,0.15)]">
        <Image
          className="w-80 object-contain"
          src="/logo-white.png"
          alt="Ícone Investify"
          width={500}
          height={500}
          priority // Garante que a imagem carregue imediatamente na splash screen
        />
      </div>
    </div>
  );
}
