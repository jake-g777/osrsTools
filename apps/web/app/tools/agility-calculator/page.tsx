import { CalculatorLayout } from "@/components/calculator-layout"
import { AgilityCalculator } from "@/components/agility-calculator"
import { Navbar } from "@/components/navbar"

export default function AgilityCalculatorPage() {
  return (
    <>
      <Navbar />
      <CalculatorLayout title="Agility Calculator">
        <AgilityCalculator />
      </CalculatorLayout>
    </>
  )
} 