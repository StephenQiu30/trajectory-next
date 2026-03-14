import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import Steps from "@/components/landing/steps"
import CTA from "@/components/landing/cta"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      <Hero />
      <Features />
      <Steps />
      <CTA />
    </main>
  )
}
