export interface Tool {
  name: string
  description: string
  icon: string
  slug: string
  tags: string[]
}

export const tools: Tool[] = [
  {
    name: "Tokkul Calculator",
    description: "Calculate Tokkul values and exchange rates",
    icon: "💎",
    slug: "tokkul-calculator",
    tags: ["Currency", "Calculator"],
  },
  {
    name: "Skilling Planner",
    description: "Create a custom Skilling Plan, any method, any skill",
    icon: "📊",
    slug: "skilling-planner",
    tags: ["Skilling", "Calculator"],
  },
  {
    name: "Birdhouse Loot Simulator",
    description: "Simulate birdhouse runs and calculate expected loot",
    icon: "🏠",
    slug: "birdhouse-simulator",
    tags: ["Skilling", "Simulator"],
  },
] 