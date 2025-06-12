import { Navbar } from "@/components/navbar"
import { ToolCard } from "@/components/tool-card"

const tools = [
  {
    name: "DPS Calculator",
    description: "Calculate damage per second for various combat setups",
    icon: "⚔️",
    slug: "dps-calculator",
    tags: ["Combat", "Calculator"],
  },
  {
    name: "Clue Tracker",
    description: "Track your clue scroll progress and rewards",
    icon: "🎯",
    slug: "clue-tracker",
    tags: ["Clues", "Progress"],
  },
  {
    name: "Tokkul Calculator",
    description: "Calculate Tokkul values and exchange rates",
    icon: "💎",
    slug: "tokkul-calculator",
    tags: ["Currency", "Calculator"],
  },
  // Add more tools here
]

export default function Home() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <main className="container py-8">
        <h1 className="font-rs text-rs-gold text-3xl mb-8 text-center">OSRS Tools & Utilities</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} {...tool} />
          ))}
        </div>
      </main>
    </div>
  )
} 