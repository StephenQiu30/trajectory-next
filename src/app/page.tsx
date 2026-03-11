import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import Steps from "@/components/landing/steps"
import CTA from "@/components/landing/cta"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#FAFAFA] dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-white overflow-x-hidden selection:bg-[#0066FF] selection:text-white">
      <Hero />
      <Features />
      <Steps />
      <CTA />
    </main>
  )
}
