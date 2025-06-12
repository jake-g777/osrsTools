import { Navbar } from "@/components/navbar"
import { TokkulCalculator } from "@/components/tokkul-calculator"

export default function TokkulCalculatorPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <main className="container py-8">
        <h1 className="font-rs text-rs-gold text-3xl mb-8 text-center">Tokkul Calculator</h1>
        <div className="max-w-2xl mx-auto">
          <TokkulCalculator />
        </div>
      </main>
    </div>
  )
} 