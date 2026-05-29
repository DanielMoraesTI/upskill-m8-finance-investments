import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Fiis from "@/components/Fiis";

export default function FundosImobiliariosPage() {
  return (
    <section className="flex w-full flex-1 flex-col">
      <Header />
      <div className="flex flex-1 items-start justify-center px-4 py-6">
        <Fiis />
      </div>
      <Footer />
    </section>
  );
}
