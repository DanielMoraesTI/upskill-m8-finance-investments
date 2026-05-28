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
      <main>
        <SidebarTrigger className="flex flex-row gap-2 items-center justify-start" />
        {children}
      </main>
    </SidebarProvider>
  );
}
