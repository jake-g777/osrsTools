"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Constants
const METHODS = {
  '18:3_pickup': { sand: 18, seaweed: 3, ratio: 1.60, glassRate: 13500 },
  '18:3_no_pickup': { sand: 18, seaweed: 3, ratio: 1.45, glassRate: 15600 },
  '12:2_no_pickup': { sand: 12, seaweed: 2, ratio: 1.45, glassRate: 10000 },
} as const

const GLASS_ITEMS = [
  { level: 1, name: "Beer glass", xp: 17.5 },
  { level: 4, name: "Candle lantern", xp: 19 },
  { level: 12, name: "Oil lamp", xp: 25 },
  { level: 33, name: "Vial", xp: 35 },
  { level: 42, name: "Fishbowl", xp: 42.5 },
  { level: 46, name: "Unpowered orb", xp: 52.5 },
  { level: 49, name: "Lantern lens", xp: 55 },
  { level: 87, name: "Empty light orb", xp: 70 },
] as const

const PRICES = {
  seaweed: 300,
  sand: 30,
  spore: 150,
  astral: 150,
  fire: 5,
  air: 5,
} as const

// XP table for levels 1-99
const XP_TABLE = [
  0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470,
  5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473,
  30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660,
  136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254,
  547953, 605032, 668051, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808,
  1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831,
  6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431
]

interface Segment {
  id: string
  startLevel: number
  endLevel: number
  glassItem: typeof GLASS_ITEMS[number]
}

interface CalculationResults {
  totalXP: number
  castsNeeded: number
  glassProduced: number
  seaweedNeeded: number
  sandNeeded: number
  sporesNeeded: number
  timeHours: number
  timeMinutes: number
  gpCost: number
  segments: Array<{
    startLevel: number
    endLevel: number
    casts: number
    glass: number
    xp: number
    glassItem: typeof GLASS_ITEMS[number]
    materials: {
      seaweed: number
      sand: number
      spores: number
    }
    runes: {
      astral: number
      fire: number
      air: number
    }
    times: {
      casting: {
        hours: number
        minutes: number
      }
      blowing: {
        hours: number
        minutes: number
      }
    }
    costs: {
      seaweed: number
      sand: number
      runes: number
      total: number
    }
  }>
}

export function GiantSeaweedCalculator() {
  const [calculationType, setCalculationType] = useState<'levels' | 'xp'>('levels')
  const [startLevel, setStartLevel] = useState(1)
  const [endLevel, setEndLevel] = useState(2)
  const [targetXP, setTargetXP] = useState(0)
  const [method, setMethod] = useState<keyof typeof METHODS>('18:3_pickup')
  const [invSeaweed, setInvSeaweed] = useState(0)
  const [invSpores, setInvSpores] = useState(0)
  const [invSand, setInvSand] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [segments, setSegments] = useState<Segment[]>([])
  const [levelWarnings, setLevelWarnings] = useState<{ [key: string]: string }>({})

  const getGlassItemForLevel = (level: number) => {
    return GLASS_ITEMS.reduce((prev, curr) => 
      curr.level <= level ? curr : prev
    )
  }

  const calculateSegment = (startLevel: number, endLevel: number, glassItem: typeof GLASS_ITEMS[number]) => {
    // Calculate XP needed for this level range
    const startXP = XP_TABLE[startLevel - 1]
    const endXP = XP_TABLE[endLevel - 1]
    const xpNeeded = endXP - startXP

    const methodData = METHODS[method]
    const xpPerCast = (methodData.seaweed * 60) + (methodData.sand * methodData.ratio * glassItem.xp)
    const castsNeeded = Math.ceil(xpNeeded / xpPerCast)
    const glassProduced = castsNeeded * methodData.sand * methodData.ratio

    // Calculate material requirements
    const seaweedNeeded = castsNeeded * methodData.seaweed
    const sandNeeded = castsNeeded * methodData.sand
    const sporesNeeded = Math.ceil(seaweedNeeded / 35) // Average of 35 giant seaweed per spore

    // Calculate rune requirements
    const astralRunes = castsNeeded * 2
    const fireRunes = castsNeeded * 6
    const airRunes = castsNeeded * 10

    // Calculate times
    const castingTimeHours = glassProduced / methodData.glassRate
    const castingTimeMinutes = Math.round((castingTimeHours - Math.floor(castingTimeHours)) * 60)
    
    // Calculate blowing time: 1.7 seconds per item + 5 seconds banking per inventory
    const itemsPerInventory = 28 // Standard inventory size
    const numInventories = Math.ceil(glassProduced / itemsPerInventory)
    const blowingTimeSeconds = (glassProduced * 1.7) + (numInventories * 5)
    const blowingTimeHours = Math.floor(blowingTimeSeconds / 3600)
    const blowingTimeMinutes = Math.round((blowingTimeSeconds % 3600) / 60)

    // Calculate GP costs
    const seaweedCost = seaweedNeeded * PRICES.seaweed
    const sandCost = sandNeeded * PRICES.sand
    const runeCost = (astralRunes * PRICES.astral) + (fireRunes * PRICES.fire) + (airRunes * PRICES.air)

    return {
      startLevel,
      endLevel,
      casts: castsNeeded,
      glass: glassProduced,
      xp: xpNeeded,
      glassItem,
      materials: {
        seaweed: seaweedNeeded,
        sand: sandNeeded,
        spores: sporesNeeded
      },
      runes: {
        astral: astralRunes,
        fire: fireRunes,
        air: airRunes
      },
      times: {
        casting: {
          hours: Math.floor(castingTimeHours),
          minutes: castingTimeMinutes
        },
        blowing: {
          hours: blowingTimeHours,
          minutes: blowingTimeMinutes
        }
      },
      costs: {
        seaweed: seaweedCost,
        sand: sandCost,
        runes: runeCost,
        total: seaweedCost + sandCost + runeCost
      }
    }
  }

  const addSegment = () => {
    if (segments.length >= endLevel - startLevel) return

    const lastSegment = segments[segments.length - 1]
    const newStartLevel = lastSegment ? lastSegment.endLevel + 1 : startLevel
    const remainingLevels = endLevel - newStartLevel
    const newEndLevel = Math.min(newStartLevel + Math.floor(remainingLevels / 2), endLevel)
    
    const newSegment = {
      id: Math.random().toString(36).substr(2, 9),
      startLevel: newStartLevel,
      endLevel: newEndLevel,
      glassItem: getGlassItemForLevel(newStartLevel)
    }

    // Update the last segment's end level if needed
    if (lastSegment) {
      updateSegment(lastSegment.id, { endLevel: newStartLevel - 1 })
    }

    setSegments([...segments, newSegment])
  }

  const updateSegment = (id: string, updates: Partial<Segment>) => {
    setSegments(segments.map(segment => 
      segment.id === id ? { ...segment, ...updates } : segment
    ))
  }

  const removeSegment = (id: string) => {
    setSegments(segments.filter(segment => segment.id !== id))
  }

  const validateLevel = (level: number, segmentId: string, type: 'start' | 'end') => {
    const segment = segments.find(s => s.id === segmentId)
    if (!segment) return

    const index = segments.findIndex(s => s.id === segmentId)
    const warnings: { [key: string]: string } = {}

    if (type === 'start') {
      if (index === 0 && level < startLevel) {
        warnings[`${segmentId}-start`] = `Start level cannot be lower than ${startLevel}`
      }
      if (index > 0 && level < segments[index - 1].endLevel) {
        warnings[`${segmentId}-start`] = `Start level must be at least ${segments[index - 1].endLevel}`
      }
      if (level >= segment.endLevel) {
        warnings[`${segmentId}-start`] = 'Start level must be lower than end level'
      }
    } else {
      if (level <= segment.startLevel) {
        warnings[`${segmentId}-end`] = 'End level must be higher than start level'
      }
      if (index < segments.length - 1 && level >= segments[index + 1].startLevel) {
        warnings[`${segmentId}-end`] = `End level must be lower than next segment's start level (${segments[index + 1].startLevel})`
      }
      if (index === segments.length - 1 && level > endLevel) {
        warnings[`${segmentId}-end`] = `End level cannot exceed ${endLevel}`
      }
    }

    setLevelWarnings(warnings)
    return Object.keys(warnings).length === 0
  }

  useEffect(() => {
    setError(null)
    setSegments([])

    // Validate inputs
    if (calculationType === 'levels') {
      if (startLevel < 1 || startLevel > 98) {
        setError("Start level must be between 1 and 98")
        setResults(null)
        return
      }
      if (endLevel <= startLevel || endLevel > 99) {
        setError("End level must be higher than start level and not exceed 99")
        setResults(null)
        return
      }
    } else {
      if (targetXP <= 0) {
        setError("Target XP must be greater than 0")
        setResults(null)
        return
      }
    }

    // Add initial segment
    const initialSegment: Segment = {
      id: Math.random().toString(36).substr(2, 9),
      startLevel,
      endLevel,
      glassItem: getGlassItemForLevel(startLevel)
    }
    setSegments([initialSegment])
  }, [calculationType, startLevel, endLevel, targetXP])

  useEffect(() => {
    if (segments.length === 0) return

    const methodData = METHODS[method]
    let totalCasts = 0
    let totalGlass = 0
    let totalXP = 0

    const calculatedSegments = segments.map(segment => {
      const result = calculateSegment(segment.startLevel, segment.endLevel, segment.glassItem)
      totalCasts += result.casts
      totalGlass += result.glass
      totalXP += result.xp
      return result
    })

    const seaweedNeeded = Math.max(0, totalCasts * methodData.seaweed - invSeaweed)
    const sandNeeded = Math.max(0, totalCasts * methodData.sand - invSand)
    const sporesNeeded = Math.ceil(seaweedNeeded / 35) // Average of 35 giant seaweed per spore
    const timeHours = totalGlass / methodData.glassRate
    const timeMinutes = Math.round((timeHours - Math.floor(timeHours)) * 60)
    const gpCost = seaweedNeeded * PRICES.seaweed + 
                  sandNeeded * PRICES.sand + 
                  sporesNeeded * PRICES.spore

    setResults({
      totalXP,
      castsNeeded: totalCasts,
      glassProduced: totalGlass,
      seaweedNeeded,
      sandNeeded,
      sporesNeeded,
      timeHours: Math.floor(timeHours),
      timeMinutes,
      gpCost,
      segments: calculatedSegments
    })
  }, [segments, method, invSeaweed, invSpores, invSand])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="rs-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-rs-gold text-2xl">Giant Seaweed Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pb-4 pt-2">
          <div className="text-xs text-rs-gold/80 italic mb-1">
            Calculate materials needed for crafting training with giant seaweed.
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-rs-gold text-lg">Calculation Method</Label>
            <RadioGroup
              value={calculationType}
              onValueChange={(value) => {
                setCalculationType(value as 'levels' | 'xp')
                setError(null)
              }}
              className="flex gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="levels" id="levels" />
                <Label htmlFor="levels" className="text-rs-gold">Level Range</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xp" id="xp" />
                <Label htmlFor="xp" className="text-rs-gold">Target XP</Label>
              </div>
            </RadioGroup>
          </div>

          {calculationType === 'levels' ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startLevel" className="text-rs-gold text-lg">Start Level</Label>
                <Input
                  id="startLevel"
                  type="number"
                  min="1"
                  max="98"
                  value={startLevel}
                  onChange={(e) => setStartLevel(Math.max(1, Math.min(98, parseInt(e.target.value) || 1)))}
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
                  onChange={(e) => setEndLevel(Math.max(startLevel + 1, Math.min(99, parseInt(e.target.value) || startLevel + 1)))}
                  className="rs-input h-9 text-base"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="targetXP" className="text-rs-gold text-lg">Target XP</Label>
              <Input
                id="targetXP"
                type="number"
                min="1"
                value={targetXP}
                onChange={(e) => setTargetXP(Math.max(0, parseInt(e.target.value) || 0))}
                className="rs-input h-9 text-base"
              />
            </div>
          )}

          <div className="border-t border-rs-brown/30 pt-6">
            <div className="space-y-4">
              <Label className="text-rs-gold text-lg">Method</Label>
              <RadioGroup
                value={method}
                onValueChange={(value) => setMethod(value as keyof typeof METHODS)}
                className="flex gap-3"
              >
                {Object.keys(METHODS).map((key) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key} className="text-rs-gold">
                      {key.replace('_', ' ').replace(':', ':')}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="border-t border-rs-brown/30 pt-6">
            <div className="space-y-4">
              <Label className="text-rs-gold text-lg">Banked Items</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invSeaweed" className="text-rs-gold text-lg">Giant Seaweed</Label>
                  <Input
                    id="invSeaweed"
                    type="number"
                    min="0"
                    value={invSeaweed}
                    onChange={(e) => setInvSeaweed(Math.max(0, parseInt(e.target.value) || 0))}
                    className="rs-input h-9 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invSpores" className="text-rs-gold text-lg">Seaweed Spores</Label>
                  <Input
                    id="invSpores"
                    type="number"
                    min="0"
                    value={invSpores}
                    onChange={(e) => setInvSpores(Math.max(0, parseInt(e.target.value) || 0))}
                    className="rs-input h-9 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invSand" className="text-rs-gold text-lg">Buckets of Sand</Label>
                  <Input
                    id="invSand"
                    type="number"
                    min="0"
                    value={invSand}
                    onChange={(e) => setInvSand(Math.max(0, parseInt(e.target.value) || 0))}
                    className="rs-input h-9 text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          {results && (
            <>
              <div className="border-t border-rs-brown/30 pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-rs-gold text-lg">Level Segments</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSegments([])}
                        variant="outline"
                        className="rs-button h-8 px-3 text-sm"
                      >
                        Clear Segments
                      </Button>
                      <Button
                        onClick={addSegment}
                        disabled={segments.length >= endLevel - startLevel}
                        className="rs-button h-8 px-3 text-sm"
                      >
                        Add Segment
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {segments.map((segment, index) => (
                      <Card key={segment.id} className="rs-card">
                        <CardContent className="p-3 space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-rs-gold font-semibold text-base">Segment {index + 1}</h3>
                            {segments.length > 1 && (
                              <Button
                                onClick={() => removeSegment(segment.id)}
                                variant="destructive"
                                className="rs-button h-7 px-2 text-xs"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label className="text-rs-gold text-sm">Start Level</Label>
                              <Input
                                type="number"
                                value={segment.startLevel}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0
                                  updateSegment(segment.id, { startLevel: value })
                                  validateLevel(value, segment.id, 'start')
                                }}
                                className="rs-input h-8 text-sm"
                              />
                              {levelWarnings[`${segment.id}-start`] && (
                                <div className="text-red-500 text-xs">{levelWarnings[`${segment.id}-start`]}</div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <Label className="text-rs-gold text-sm">End Level</Label>
                              <Input
                                type="number"
                                value={segment.endLevel}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0
                                  updateSegment(segment.id, { endLevel: value })
                                  validateLevel(value, segment.id, 'end')
                                }}
                                className="rs-input h-8 text-sm"
                              />
                              {levelWarnings[`${segment.id}-end`] && (
                                <div className="text-red-500 text-xs">{levelWarnings[`${segment.id}-end`]}</div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <Label className="text-rs-gold text-sm">Glass Item</Label>
                              <Select
                                value={segment.glassItem.name}
                                onValueChange={(value) => {
                                  const item = GLASS_ITEMS.find(item => item.name === value)
                                  if (item) {
                                    updateSegment(segment.id, { glassItem: item })
                                  }
                                }}
                              >
                                <SelectTrigger className="rs-input h-8 text-xs">
                                  <SelectValue>
                                    {segment.glassItem.name} ({segment.glassItem.level})
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {GLASS_ITEMS.map(item => (
                                    <SelectItem 
                                      key={item.name} 
                                      value={item.name}
                                      className={`text-xs pl-4 data-[state=checked]:text-green-500 data-[state=checked]:bg-transparent ${item.level > segment.endLevel ? "opacity-50 cursor-not-allowed" : ""}`}
                                      disabled={item.level > segment.endLevel}
                                    >
                                      {item.name} (Level {item.level})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {results && results.segments[index] && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <div className="text-rs-gold/80 text-xs font-semibold">Progress</div>
                                  <div className="grid grid-cols-2 gap-2 text-rs-gold/80 text-xs">
                                    <div>Casts: {results.segments[index].casts.toLocaleString()}</div>
                                    <div>Glass: {results.segments[index].glass.toLocaleString()}</div>
                                    <div>XP: {results.segments[index].xp.toLocaleString()}</div>
                                    <div>XP/Glass: {((results.segments[index].xp / results.segments[index].glass) || 0).toFixed(1)}</div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-rs-gold/80 text-xs font-semibold">Time Required</div>
                                  <div className="grid grid-cols-2 gap-2 text-rs-gold/80 text-xs">
                                    <div>Cast: {results.segments[index].times.casting.hours}h {results.segments[index].times.casting.minutes}m</div>
                                    <div>Blow: {results.segments[index].times.blowing.hours}h {results.segments[index].times.blowing.minutes}m</div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <div className="text-rs-gold/80 text-xs font-semibold">Materials</div>
                                  <div className="grid grid-cols-1 gap-1 text-rs-gold/80 text-xs">
                                    <div>Seaweed: {results.segments[index].materials.seaweed.toLocaleString()}</div>
                                    <div>Sand: {results.segments[index].materials.sand.toLocaleString()}</div>
                                    <div>Spores: {results.segments[index].materials.spores.toLocaleString()}</div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-rs-gold/80 text-xs font-semibold">Runes</div>
                                  <div className="grid grid-cols-1 gap-1 text-rs-gold/80 text-xs">
                                    <div>Astral: {results.segments[index].runes.astral.toLocaleString()}</div>
                                    <div>Fire: {results.segments[index].runes.fire.toLocaleString()}</div>
                                    <div>Air: {results.segments[index].runes.air.toLocaleString()}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-rs-gold/80 text-xs font-semibold">Costs</div>
                                <div className="grid grid-cols-2 gap-2 text-rs-gold/80 text-xs">
                                  <div>Seaweed: {results.segments[index].costs.seaweed.toLocaleString()} gp</div>
                                  <div>Sand: {results.segments[index].costs.sand.toLocaleString()} gp</div>
                                  <div>Runes: {results.segments[index].costs.runes.toLocaleString()} gp</div>
                                  <div className="font-semibold">Total: {results.segments[index].costs.total.toLocaleString()} gp</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-rs-brown/30 pt-6">
                <div className="space-y-4">
                  <Label className="text-rs-gold text-lg">Results</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rs-brown/10 rounded p-3">
                      <div className="text-rs-gold/80 text-sm">Total XP</div>
                      <div className="text-rs-gold text-xl font-semibold">{results.totalXP.toLocaleString()}</div>
                    </div>
                    <div className="bg-rs-brown/10 rounded p-3">
                      <div className="text-rs-gold/80 text-sm">Total Casts</div>
                      <div className="text-rs-gold text-xl font-semibold">{results.castsNeeded.toLocaleString()}</div>
                    </div>
                    <div className="bg-rs-brown/10 rounded p-3">
                      <div className="text-rs-gold/80 text-sm">Casting Time</div>
                      <div className="text-rs-gold text-xl font-semibold">{results.timeHours}h {results.timeMinutes}m</div>
                    </div>
                    <div className="bg-rs-brown/10 rounded p-3">
                      <div className="text-rs-gold/80 text-sm">Blowing Time</div>
                      <div className="text-rs-gold text-xl font-semibold">
                        {Math.floor(results.glassProduced * 1.7 / 3600)}h {Math.round((results.glassProduced * 1.7 % 3600) / 60)}m
                      </div>
                    </div>
                    <div className="bg-rs-brown/10 rounded p-3">
                      <div className="text-rs-gold/80 text-sm">Total GP Cost</div>
                      <div className="text-rs-gold text-xl font-semibold">{results.gpCost.toLocaleString()}</div>
                    </div>
                    <div className="bg-rs-brown/10 rounded p-3">
                      <div className="text-rs-gold/80 text-sm">Total Glass</div>
                      <div className="text-rs-gold text-xl font-semibold">{results.glassProduced.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm font-semibold mb-2">Total Materials Needed</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-rs-gold/80 text-sm">Giant Seaweed</div>
                        <div className="text-rs-gold text-lg font-semibold">{results.seaweedNeeded.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-rs-gold/80 text-sm">Buckets of Sand</div>
                        <div className="text-rs-gold text-lg font-semibold">{results.sandNeeded.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-rs-gold/80 text-sm">Seaweed Spores</div>
                        <div className="text-rs-gold text-lg font-semibold">{results.sporesNeeded.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm font-semibold mb-2">Total Runes Needed</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-rs-gold/80 text-sm">Astral Runes</div>
                        <div className="text-rs-gold text-lg font-semibold">{results.castsNeeded * 2}</div>
                      </div>
                      <div>
                        <div className="text-rs-gold/80 text-sm">Fire Runes</div>
                        <div className="text-rs-gold text-lg font-semibold">{results.castsNeeded * 6}</div>
                      </div>
                      <div>
                        <div className="text-rs-gold/80 text-sm">Air Runes</div>
                        <div className="text-rs-gold text-lg font-semibold">{results.castsNeeded * 10}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}