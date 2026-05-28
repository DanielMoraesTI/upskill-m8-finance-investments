// import Navbar from "@/components/Navbar";
// import Navbares from "@/components/Navbares";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Shadbar from "@/components/Shadbar";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Shadbar />
      <main>
        <SidebarTrigger className="flex flex-row gap-2 items-center justify-start" />
        {children}
      </main>
    </SidebarProvider>
  );
}

// return (
//   <div className="min-h-screen md:flex">
//     <Navbares />

//     <div className="min-h-screen w-full min-w-0 bg-green-500 md:flex-1">
//       {children}
//     </div>
//   </div>
// );
