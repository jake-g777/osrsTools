"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X } from "lucide-react"

// Birdhouse types and their base XP
const BIRDHOUSE_TYPES = [
  { name: "Regular", xp: 280, level: 5 },
  { name: "Oak", xp: 420, level: 14 },
  { name: "Willow", xp: 560, level: 24 },
  { name: "Teak", xp: 700, level: 34 },
  { name: "Maple", xp: 820, level: 44 },
  { name: "Mahogany", xp: 960, level: 49 },
  { name: "Yew", xp: 1020, level: 59 },
  { name: "Magic", xp: 1140, level: 74 },
  { name: "Redwood", xp: 1200, level: 89}
]

// Common bird nests and their drop rates
const BIRD_NESTS = [
  { name: "Empty", chance: 0.4, image: "/images/items/empty_nest.png" },
  { name: "Seed", chance: 0.3, image: "/images/items/seed_nest.png" },
  { name: "Ring", chance: 0.2, image: "/images/items/ring_nest.png" },
  { name: "Egg", chance: 0.1, image: "/images/items/egg_nest.png" },
]

// Official OSRS XP table
const XP_TABLE = [
  0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431
]

export function BirdhouseSimulator() {
  const [calculationType, setCalculationType] = useState<'runs' | 'levels'>('runs')
  const [runs, setRuns] = useState(1)
  const [startLevel, setStartLevel] = useState(1)
  const [endLevel, setEndLevel] = useState(2)
  const [selectedType, setSelectedType] = useState(BIRDHOUSE_TYPES[0].name)
  const [hasRabbitFoot, setHasRabbitFoot] = useState(false)
  const [results, setResults] = useState<{
    hunterXp: number;
    craftingXp: number;
    nests: Record<string, number>;
  } | null>(null)
  const [simulatedRuns, setSimulatedRuns] = useState<number | null>(null)

  const calculateRequiredRuns = (startLevel: number, endLevel: number, xpPerRun: number) => {
    const startXp = XP_TABLE[startLevel - 1]
    const endXp = XP_TABLE[endLevel - 1]
    const xpNeeded = endXp - startXp
    return Math.ceil(xpNeeded / xpPerRun)
  }

  const handleStartLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    const newStartLevel = Math.max(1, Math.min(98, value))
    setStartLevel(newStartLevel)
    if (endLevel <= newStartLevel) {
      setEndLevel(Math.min(99, newStartLevel + 1))
    }
  }

  const handleEndLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || startLevel + 1
    const newEndLevel = Math.max(startLevel + 1, Math.min(99, value))
    setEndLevel(newEndLevel)
  }

  const simulateRun = () => {
    const birdhouse = BIRDHOUSE_TYPES.find(b => b.name === selectedType)
    if (!birdhouse) return
    // Each run = 4 birdhouses
    const xpPerRun = birdhouse.xp * 4
    const runsToSimulate = calculationType === 'levels' 
      ? calculateRequiredRuns(startLevel, endLevel, xpPerRun)
      : runs

    let hunterXp = 0
    let craftingXp = 0
    const nests: Record<string, number> = {}

    for (let i = 0; i < runsToSimulate; i++) {
      // Add XP for 4 birdhouses per run
      hunterXp += birdhouse.xp * 4
      craftingXp += Math.floor(birdhouse.xp * 0.2) * 4
      // Simulate loot for 4 birdhouses per run
      for (let b = 0; b < 4; b++) {
        // Simulate nest drops (1-3 nests per birdhouse, +1 if rabbit foot)
        const baseNestCount = Math.floor(Math.random() * 3) + 1
        const nestCount = hasRabbitFoot ? baseNestCount + 1 : baseNestCount
        for (let j = 0; j < nestCount; j++) {
          const roll = Math.random()
          let cumulativeChance = 0
          for (const nest of BIRD_NESTS) {
            cumulativeChance += nest.chance
            if (roll <= cumulativeChance) {
              nests[nest.name] = (nests[nest.name] || 0) + 1
              break
            }
          }
        }
      }
    }
    setResults({ hunterXp, craftingXp, nests })
    setSimulatedRuns(runsToSimulate)
  }

  const handleClear = () => {
    setResults(null)
    setSimulatedRuns(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="rs-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-rs-gold text-2xl">Birdhouse Loot Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4 pt-2">
          <div className="text-xs text-rs-gold/80 italic mb-1">Each birdhouse run assumes 4 birdhouses are checked.</div>
          <div className="space-y-2">
            <Label className="text-rs-gold text-lg">Calculation Method</Label>
            <RadioGroup
              value={calculationType}
              onValueChange={(value) => setCalculationType(value as 'runs' | 'levels')}
              className="flex gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="runs" id="runs" />
                <Label htmlFor="runs" className="text-rs-gold">Number of Runs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="levels" id="levels" />
                <Label htmlFor="levels" className="text-rs-gold">Level Range</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {calculationType === 'runs' ? (
              <div className="space-y-2">
                <Label htmlFor="runs" className="text-rs-gold text-lg">Number of Runs</Label>
                <Input
                  id="runs"
                  type="number"
                  min="1"
                  value={runs}
                  onChange={(e) => setRuns(Math.max(1, parseInt(e.target.value) || 1))}
                  className="rs-input h-9 text-base"
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startLevel" className="text-rs-gold text-lg">Start Level</Label>
                  <Input
                    id="startLevel"
                    type="number"
                    min="1"
                    max="98"
                    value={startLevel}
                    onChange={handleStartLevelChange}
                    className="rs-input h-9 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endLevel" className="text-rs-gold text-lg">End Level</Label>
                  <Input
                    id="endLevel"
                    type="number"
                    min={startLevel + 1}
                    max="99"
                    value={endLevel}
                    onChange={handleEndLevelChange}
                    className="rs-input h-9 text-base"
                  />
                  {endLevel <= startLevel && (
                    <p className="text-red-500 text-sm mt-1">
                      End level must be higher than start level
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-rs-gold text-lg">Birdhouse Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="rs-input h-9 text-base">
                  <SelectValue placeholder="Select birdhouse type" />
                </SelectTrigger>
                <SelectContent>
                  {BIRDHOUSE_TYPES.map((type) => (
                    <SelectItem key={type.name} value={type.name}>
                      {type.name} (Level {type.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <Checkbox
              id="rabbitFoot"
              checked={hasRabbitFoot}
              onCheckedChange={(checked) => setHasRabbitFoot(checked as boolean)}
            />
            <Label htmlFor="rabbitFoot" className="text-rs-gold text-base">
              Wearing Strung Rabbit Foot (+1 nest per run)
            </Label>
          </div>

          <Button onClick={simulateRun} className="rs-button w-full h-10 text-base mt-2">
            Simulate {calculationType === 'levels' ? 'Level Range' : 'Runs'}
          </Button>
        </CardContent>
      </Card>

      {/* Results and Inventory */}
      {results ? (
        <div className="space-y-6">
          {/* Loot Section */}
          <div className="bg-[#4A3C31] border-4 border-[#2D2319] rounded-lg p-6 relative">
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 text-rs-gold hover:text-red-500 transition-colors"
              title="Clear loot/results"
              aria-label="Clear loot/results"
            >
              <X size={20} />
            </button>
            <div className="flex items-center mb-4 gap-2">
              <h3 className="text-rs-gold text-2xl">Loot Obtained</h3>
              {simulatedRuns !== null && (
                <span className="text-rs-gold/80 text-base font-normal">from {simulatedRuns.toLocaleString()} birdhouse runs</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(results.nests).map(([type, count]) => {
                const nestInfo = BIRD_NESTS.find(n => n.name === type)
                return (
                  <div key={type} className="relative bg-[#2D2319] rounded p-3 flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={nestInfo?.image || '/images/items/placeholder.png'}
                        alt={type}
                        className="w-16 h-16"
                        onError={(e) => {
                          e.currentTarget.src = '/images/items/placeholder.png'
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[#2D2319] text-rs-gold px-2 rounded text-base border border-rs-gold/30">
                        {count}
                      </div>
                    </div>
                    <div className="text-center text-rs-gold text-base mt-2">
                      {type}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Slim Results Row */}
          <Card className="rs-card p-0">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-rs-gold text-xl">Results</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="flex flex-wrap gap-x-8 gap-y-2 items-center text-rs-gold text-base">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Hunter XP:</span>
                  <span>{results.hunterXp.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Crafting XP:</span>
                  <span>{results.craftingXp.toLocaleString()}</span>
                </div>
                {calculationType === 'levels' && (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Runs Required:</span>
                    <span>{simulatedRuns?.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="rs-card h-48 flex items-center justify-center">
          <CardHeader>
            <CardTitle className="text-rs-gold text-2xl">Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-rs-gold/60 text-2xl">
            Run a simulation to see results
          </CardContent>
        </Card>
      )}
    </div>
  )
} 