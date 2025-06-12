import { SkillingPlanner } from "@/components/skilling-planner"
import { Navbar } from "@/components/navbar"
import { CalculatorLayout } from "@/components/calculator-layout"

export default function SkillingPlannerPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <CalculatorLayout title="Skilling Planner">
        <SkillingPlanner />
      </CalculatorLayout>
    </div>
  )
} 