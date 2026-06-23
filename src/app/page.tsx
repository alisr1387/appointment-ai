import { Features } from "@/components/landing/features";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { Problem } from "@/components/landing/problem";
import { ProductDashboard } from "@/components/landing/product-dashboard";
import { SocialProof } from "@/components/landing/social-proof";
import { Solution } from "@/components/landing/solution";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SocialProof />
      <Problem />
      <Solution />
      <Features />
      <ProductDashboard />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
