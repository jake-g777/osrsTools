import { CalculatorLayout } from "@/components/calculator-layout"
import { BirdhouseSimulator } from "@/components/birdhouse-simulator"
import { Navbar } from "@/components/navbar"

export default function BirdhouseSimulatorPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <CalculatorLayout title="Birdhouse Loot Simulator">
        <div className="max-w-7xl mx-auto">
          <BirdhouseSimulator />
        </div>
      </CalculatorLayout>
    </div>
  )
} 