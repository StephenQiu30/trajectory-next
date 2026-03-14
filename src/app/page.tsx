import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import Steps from '@/components/landing/steps'
import CTA from '@/components/landing/cta'

export default function Home() {
  return (
    <main className="bg-background text-foreground selection:bg-primary/30 selection:text-primary flex min-h-screen flex-col items-center overflow-x-hidden">
      <Hero />
      <Features />
      <Steps />
      <CTA />
    </main>
  )
}
