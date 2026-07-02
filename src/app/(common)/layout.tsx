import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/modules/homepage/Footer";

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col">
      <Navbar />
      <main className="flex-1 pt-12">{children}</main>
      <Footer />
    </div>
  );
}
