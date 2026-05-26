import { Navbar } from "@/components/Navbar";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <style>{`
        .portal-content-offset {
          margin-left: 0;
        }

        @media (min-width: 640px) {
          .portal-content-offset {
            margin-left: 15rem;
          }
        }
      `}</style>
      <Navbar />
      <div className="portal-content-offset">{children}</div>
    </>
  );
}
