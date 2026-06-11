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
      {/** Container para ocupar toda a tela com cara de "web app" */}
      <div
        className="min-w-screen max-w-screen min-h-screen max-h-screen overflow-hidden
        flex flex-col md:flex-row
      "
      >
        <Navbar />
        <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] w-full h-full">
          <Header />
          <main className="flex flex-1 flex-col w-full items-center">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
