import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-6 py-24 text-center">
        <h1 className="font-display text-6xl font-extrabold text-navy">404</h1>
        <p className="mt-4 text-lg text-navy/70">Page Not Found</p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange/90"
        >
          Return Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
