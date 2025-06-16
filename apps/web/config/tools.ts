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
  {
    name: "Giant Seaweed Calculator",
    description: "Calculate materials needed for crafting training with giant seaweed",
    icon: "🌊",
    slug: "giant-seaweed-calculator",
    tags: ["Skilling", "Calculator"],
  },
  {
    name: "Agility Calculator",
    description: "Calculate XP and time needed for Agility training",
    icon: "🏃",
    slug: "agility-calculator",
    tags: ["Skilling", "Calculator"],
  },
  {
    name: "Wilderness Agility Simulator",
    description: "Simulate training at the Wilderness Agility Course",
    icon: "🏃‍♂️",
    slug: "wilderness-agility-simulator",
    tags: ["Skilling", "Simulator"],
  },
] 