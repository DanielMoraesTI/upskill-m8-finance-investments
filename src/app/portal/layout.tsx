import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Navbar />
      <main className="flex min-h-screen flex-1 flex-col">
        <SidebarTrigger className="flex flex-row gap-2 items-center justify-start" />
        {children}
      </main>
    </SidebarProvider>
  );
}
