import { Navbar } from "@/components/Navbar";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen md:flex">
      <Navbar />

      <div className="min-h-screen w-full min-w-0 bg-green-500 md:flex-1">
        {children}
      </div>
    </div>
  );
}
