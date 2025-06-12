import { CalculatorLayout } from "@/components/calculator-layout"
import { TokkulCalculator } from "@/components/tokkul-calculator"
import { Navbar } from "@/components/navbar"

export default function TokkulCalculatorPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <CalculatorLayout title="Tokkul Calculator">
        <div className="max-w-2xl mx-auto">
          <TokkulCalculator />
        </div>
      </CalculatorLayout>
    </div>
  )
} 