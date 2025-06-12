import { Navbar } from "@/components/navbar"
import { ToolCard } from "@/components/tool-card"
import { tools } from "@/config/tools"

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