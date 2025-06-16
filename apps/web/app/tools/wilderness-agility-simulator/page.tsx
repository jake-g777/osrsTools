import { CalculatorLayout } from "@/components/calculator-layout"
import { WildernessAgilitySimulator } from "@/components/wilderness-agility-simulator"
import { Navbar } from "@/components/navbar"

export default function WildernessAgilitySimulatorPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <CalculatorLayout title="Wilderness Agility Simulator">
        <WildernessAgilitySimulator />
      </CalculatorLayout>
    </div>
  )
} 