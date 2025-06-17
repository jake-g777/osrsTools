import { CalculatorLayout } from "@/components/calculator-layout"
import { BirdhouseSimulator } from "@/components/birdhouse-simulator"
import { Navbar } from "@/components/navbar"

export default function BirdhouseSimulatorPage() {
  const toolRelatedInfo = {
    title: "Source Links",
    links: [
      {
        name: "OSRS Wiki - Bird House Trapping",
        url: "https://oldschool.runescape.wiki/w/Bird_house_trapping"
      },
      {
        name: "OSRS Wiki - Bird Houses",
        url: "https://oldschool.runescape.wiki/w/Bird_house"
      },
      {
        name: "OSRS Wiki - Bird House Seeds",
        url: "https://oldschool.runescape.wiki/w/Bird_house_seeds"
      }
    ],
    tips: [
      "Each birdhouse run consists of checking 4 birdhouses",
      "Birdhouses can be checked every 50 minutes",
      "Wearing a strung rabbit foot gives +1 seed nest",
      "Higher tier birdhouses give more XP and better loot"
    ]
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <CalculatorLayout title="Birdhouse Loot Simulator" toolRelatedInfo={toolRelatedInfo}>
        <div className="max-w-7xl mx-auto">
          <BirdhouseSimulator />
        </div>
      </CalculatorLayout>
    </div>
  )
} 