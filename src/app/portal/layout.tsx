import { Suspense } from "react";
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
        flex flex-col md:flex-row bg-background
      "
      >
        <Suspense>
          <Navbar />
        </Suspense>
        <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] w-full h-full overflow-auto">
          <Header />
          <main className="flex flex-1 flex-col w-full items-center overflow-y-auto">
            {children}
          </main>
          <Suspense>
            <Footer />
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  );
}
