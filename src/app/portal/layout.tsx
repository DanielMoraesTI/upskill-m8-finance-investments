import { Navbar } from "@/components/Navbar";
import Header from "@/components/Header";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   <style>{`
  //   .portal-content-offset {
  //     margin-left: 0;
  //   }

  //   @media (min-width: 640px) {
  //     .portal-content-offset {
  //       margin-left: 15rem;
  //     }
  //   }
  // `}</style>
  // return (
  //   <div className="bg-red-500">
  //     <Navbar />
  //     <div className="portal-content-offset">{children}</div>
  //   </div>
  // );

  return (
    <div className="flex flex-col md:flex-row bg-red-500 min-w-screen min-h-screen">
      <Header />

      <div className="flex-1 w-full h-full md:h-screen bg-green-500">
        {children}
      </div>
    </div>
  );
}
