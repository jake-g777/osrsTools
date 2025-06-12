"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const OSRS_SKILLS = [
  { name: "Attack", icon: "⚔️" },
  { name: "Strength", icon: "💪" },
  { name: "Defence", icon: "🛡️" },
  { name: "Ranged", icon: "🏹" },
  { name: "Prayer", icon: "🙏" },
  { name: "Magic", icon: "✨" },
  { name: "Runecraft", icon: "🔮" },
  { name: "Hitpoints", icon: "❤️" },
  { name: "Crafting", icon: "🛠️" },
  { name: "Mining", icon: "⛏️" },
  { name: "Smithing", icon: "⚒️" },
  { name: "Fishing", icon: "🎣" },
  { name: "Cooking", icon: "🍳" },
  { name: "Firemaking", icon: "🔥" },
  { name: "Woodcutting", icon: "🪓" },
  { name: "Agility", icon: "🏃" },
  { name: "Herblore", icon: "🌿" },
  { name: "Thieving", icon: "🦹" },
  { name: "Fletching", icon: "🏹" },
  { name: "Slayer", icon: "💀" },
  { name: "Farming", icon: "🌱" },
  { name: "Construction", icon: "🏠" },
  { name: "Hunter", icon: "🦊" },
] as const

export function SkillingPlanner() {
  const [selectedSkill, setSelectedSkill] = React.useState<string>("")
  const [currentLevel, setCurrentLevel] = React.useState<string>("")
  const [goalLevel, setGoalLevel] = React.useState<string>("")
  const [goalXP, setGoalXP] = React.useState<string>("")

  // Function to calculate XP for a given level
  const getXPForLevel = (level: number): number => {
    let xp = 0
    for (let i = 1; i < level; i++) {
      xp += Math.floor(i + 300 * Math.pow(2, i / 7))
    }
    return Math.floor(xp / 4)
  }

  // Update goal XP when goal level changes
  React.useEffect(() => {
    if (goalLevel && !isNaN(Number(goalLevel))) {
      const xp = getXPForLevel(Number(goalLevel))
      setGoalXP(xp.toString())
    }
  }, [goalLevel])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Skilling Planner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="skill">Select Skill</Label>
          <Select
            value={selectedSkill}
            onValueChange={setSelectedSkill}
          >
            <SelectTrigger id="skill">
              <SelectValue placeholder="Choose a skill">
                {selectedSkill && (
                  <div className="flex items-center gap-2">
                    <span>{OSRS_SKILLS.find(skill => skill.name === selectedSkill)?.icon}</span>
                    <span>{selectedSkill}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[400px]">
              <div className="grid grid-cols-3 gap-2 p-2">
                {OSRS_SKILLS.map((skill) => (
                  <SelectItem
                    key={skill.name}
                    value={skill.name}
                    className="cursor-pointer rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span>{skill.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current-level">Current Level</Label>
            <Input
              id="current-level"
              type="number"
              min="1"
              max="99"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              placeholder="Enter current level"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-level">Goal Level</Label>
            <Input
              id="goal-level"
              type="number"
              min="1"
              max="99"
              value={goalLevel}
              onChange={(e) => setGoalLevel(e.target.value)}
              placeholder="Enter goal level"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal-xp">Goal XP</Label>
          <Input
            id="goal-xp"
            type="number"
            value={goalXP}
            onChange={(e) => setGoalXP(e.target.value)}
            placeholder="Enter goal XP"
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  )
} 