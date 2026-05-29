import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <section className="flex w-full flex-1 flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <Dashboard />
      </div>
      <Footer />
    </section>
  );
}
