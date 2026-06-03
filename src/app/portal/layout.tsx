import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
        <section className="flex w-full flex-1 flex-col">
          <Header />
          <div className="flex flex-1 items-start justify-center px-4 py-6">
            {children}
          </div>
          <Footer />
        </section>
      </main>
    </SidebarProvider>
  );
}
