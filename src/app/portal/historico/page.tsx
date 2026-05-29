import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function HistoricoPage() {
  return (
    <section className="flex w-full flex-1 flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <h1 className="text-xl font-semibold">Histórico</h1>
      </div>
      <Footer />
    </section>
  );
}
