import { CalculatorLayout } from "@/components/calculator-layout"
import { GiantSeaweedCalculator } from "@/components/giant-seaweed-calculator"
import { Navbar } from "@/components/navbar"

export default function GiantSeaweedCalculatorPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <CalculatorLayout title="Giant Seaweed Calculator">
        <GiantSeaweedCalculator />
      </CalculatorLayout>
    </div>
  )
} 