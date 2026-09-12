import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Portfolio from "@/components/sections/Portfolio";
import Process from "@/components/sections/Process";
import Industries from "@/components/sections/Industries";
import Clients from "@/components/sections/Clients";
import Testimonials from "@/components/sections/Testimonials";
import Stats from "@/components/sections/Stats";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen overflow-x-hidden bg-white">
        <Hero />
        <Intro />
        <Services />
        <WhyChooseUs />
        <Portfolio />
        <Process />
        <Industries />
        <Clients />
        <Testimonials />
        <Stats />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
