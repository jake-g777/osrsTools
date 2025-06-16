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
import { collectBirdhouse, type BirdhouseTier, type LootDrop } from "@/lib/birdhouse"

// Types
interface BirdhouseType {
  name: string;
  xp: number;
  level: number;
  tier: BirdhouseTier;
}

interface SimulationResults {
  hunterXp: number;
  craftingXp: number;
  loot: LootDrop[];
}

interface SimulationError {
  message: string;
  field?: 'startLevel' | 'endLevel' | 'runs' | 'type';
}

// Constants
const BIRDHOUSE_TYPES: BirdhouseType[] = [
  { name: "Regular", xp: 280, level: 5, tier: 'regular' as BirdhouseTier },
  { name: "Oak", xp: 420, level: 14, tier: 'oak' as BirdhouseTier },
  { name: "Willow", xp: 560, level: 24, tier: 'willow' as BirdhouseTier },
  { name: "Teak", xp: 700, level: 34, tier: 'teak' as BirdhouseTier },
  { name: "Maple", xp: 820, level: 44, tier: 'maple' as BirdhouseTier },
  { name: "Mahogany", xp: 960, level: 49, tier: 'mahogany' as BirdhouseTier },
  { name: "Yew", xp: 1020, level: 59, tier: 'yew' as BirdhouseTier },
  { name: "Magic", xp: 1140, level: 74, tier: 'magic' as BirdhouseTier },
  { name: "Redwood", xp: 1200, level: 89, tier: 'redwood' as BirdhouseTier }
]

// Official OSRS XP table (1-99)
const XP_TABLE = [
  0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431
]

// Helper function to get XP for a level
function getXpForLevel(level: number): number {
  return XP_TABLE[level - 1] || 0
}

// Helper function to get level for XP
function getLevelForXp(xp: number): number {
  for (let level = 1; level <= 99; level++) {
    if (XP_TABLE[level] > xp) {
      return level
    }
  }
  return 99
}

export function BirdhouseSimulator() {
  const [calculationType, setCalculationType] = useState<'runs' | 'levels'>('runs')
  const [runs, setRuns] = useState(1)
  const [startLevel, setStartLevel] = useState(1)
  const [endLevel, setEndLevel] = useState(2)
  const [selectedType, setSelectedType] = useState(BIRDHOUSE_TYPES[0].name)
  const [hasRabbitFoot, setHasRabbitFoot] = useState(false)
  const [results, setResults] = useState<SimulationResults | null>(null)
  const [simulatedRuns, setSimulatedRuns] = useState<number | null>(null)
  const [error, setError] = useState<SimulationError | null>(null)

  const validateInputs = (): boolean => {
    setError(null)

    // Validate birdhouse type
    const birdhouse = BIRDHOUSE_TYPES.find(b => b.name === selectedType)
    if (!birdhouse) {
      setError({ message: "Invalid birdhouse type selected", field: 'type' })
      return false
    }

    // Validate level-based calculation
    if (calculationType === 'levels') {
      if (startLevel < 1 || startLevel > 98) {
        setError({ message: "Start level must be between 1 and 98", field: 'startLevel' })
        return false
      }
      if (endLevel <= startLevel || endLevel > 99) {
        setError({ message: "End level must be higher than start level and not exceed 99", field: 'endLevel' })
        return false
      }
      if (startLevel < birdhouse.level) {
        setError({ message: `Start level must be at least ${birdhouse.level} for ${birdhouse.name} birdhouses`, field: 'startLevel' })
        return false
      }
    }

    // Validate run-based calculation
    if (calculationType === 'runs') {
      if (runs < 1 || runs > 1000) {
        setError({ message: "Number of runs must be between 1 and 1000", field: 'runs' })
        return false
      }
    }

    return true
  }

  const calculateRequiredRuns = (startLevel: number, endLevel: number, xpPerRun: number): number => {
    const startXp = getXpForLevel(startLevel)
    const endXp = getXpForLevel(endLevel)
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
    setError(null)
  }

  const handleEndLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || startLevel + 1
    const newEndLevel = Math.max(startLevel + 1, Math.min(99, value))
    setEndLevel(newEndLevel)
    setError(null)
  }

  const handleRunsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setRuns(Math.max(1, Math.min(1000, value)))
    setError(null)
  }

  const simulateRun = () => {
    if (!validateInputs()) return

    const birdhouse = BIRDHOUSE_TYPES.find(b => b.name === selectedType)
    if (!birdhouse) return

    try {
      // Each run = 4 birdhouses
      const xpPerRun = birdhouse.xp * 4
      const runsToSimulate = calculationType === 'levels' 
        ? calculateRequiredRuns(startLevel, endLevel, xpPerRun)
        : runs

      let hunterXp = 0
      let craftingXp = 0
      const lootMap = new Map<string, number>()

      // Simulate each run (4 birdhouses per run)
      for (let i = 0; i < runsToSimulate; i++) {
        // Add XP for 4 birdhouses
        hunterXp += birdhouse.xp * 4
        // Crafting XP is 20% of Hunter XP, rounded down
        craftingXp += Math.floor(birdhouse.xp * 0.2) * 4

        // Simulate loot for 4 birdhouses
        for (let j = 0; j < 4; j++) {
          const loot = collectBirdhouse(
            calculationType === 'levels' ? startLevel : birdhouse.level,
            birdhouse.tier,
            hasRabbitFoot
          )
          
          // Aggregate loot
          loot.forEach(item => {
            lootMap.set(item.id, (lootMap.get(item.id) || 0) + item.qty)
          })
        }
      }

      // Convert loot map to array
      const lootArray: LootDrop[] = Array.from(lootMap.entries()).map(([id, qty]) => ({
        id,
        qty
      }))

      setResults({ hunterXp, craftingXp, loot: lootArray })
      setSimulatedRuns(runsToSimulate)
    } catch (err) {
      setError({ 
        message: err instanceof Error ? err.message : "An error occurred during simulation" 
      })
    }
  }

  const handleClear = () => {
    setResults(null)
    setSimulatedRuns(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="rs-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-rs-gold text-2xl">Birdhouse Loot Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4 pt-2">
          <div className="text-xs text-rs-gold/80 italic mb-1">Each birdhouse run assumes 4 birdhouses are checked.</div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-red-500 text-sm">
              {error.message}
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-rs-gold text-lg">Calculation Method</Label>
            <RadioGroup
              value={calculationType}
              onValueChange={(value) => {
                setCalculationType(value as 'runs' | 'levels')
                setError(null)
              }}
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
                  max="1000"
                  value={runs}
                  onChange={handleRunsChange}
                  className={`rs-input h-9 text-base ${error?.field === 'runs' ? 'border-red-500' : ''}`}
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
                    className={`rs-input h-9 text-base ${error?.field === 'startLevel' ? 'border-red-500' : ''}`}
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
                    className={`rs-input h-9 text-base ${error?.field === 'endLevel' ? 'border-red-500' : ''}`}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-rs-gold text-lg">Birdhouse Type</Label>
              <Select 
                value={selectedType} 
                onValueChange={(value) => {
                  setSelectedType(value)
                  setError(null)
                }}
              >
                <SelectTrigger className={`rs-input h-8 text-xs ${error?.field === 'type' ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select birdhouse type" />
                </SelectTrigger>
                <SelectContent>
                  {BIRDHOUSE_TYPES.map((type) => (
                    <SelectItem key={type.name} value={type.name} className="text-xs pl-4">
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

          <Button 
            onClick={simulateRun} 
            className="rs-button w-full h-10 text-base mt-2"
            disabled={!!error}
          >
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
            {results.loot.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.loot.map((item) => (
                  <div key={item.id} className="relative bg-[#2D2319] rounded p-3 flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={`/images/items/${item.id}.png`}
                        alt={item.id}
                        className="w-16 h-16"
                        onError={(e) => {
                          e.currentTarget.src = '/images/items/placeholder.png'
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[#2D2319] text-rs-gold px-2 rounded text-base border border-rs-gold/30">
                        {item.qty.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center text-rs-gold text-base mt-2">
                      {item.id.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-rs-gold/60 text-lg py-8">
                No loot obtained from simulation
              </div>
            )}
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