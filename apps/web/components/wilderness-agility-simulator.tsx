"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

// Types
type Drop = { id: string; weight: number; qty: [number, number]; gp: number }

interface LootItem {
  id: string
  name: string
  qty: number
  gp: number
}

interface SimulationResults {
  totalXP: number
  totalLaps: number
  timeHours: number
  timeMinutes: number
  tickets: number
  clues: number
  lootBreakdown: LootItem[]
  lootGp: number
  totalGp: number
  lootingBag: boolean
}

// Constants for Wilderness Agility Course
const XP_PER_LAP = 571.4
const LAPS_PER_HOUR = 83 // 45 seconds per lap + 2:10 bank time per hour
const DISPENSER_FEE = 150_000 // GP fee to use the dispenser
const CLUE_ODDS = 40 // 1 in 40 (no RoW toggle)

// Helper functions
const rand = (n = 1) => Math.random() * n
const rInt = (a: number, b: number) => Math.floor(rand(b - a + 1)) + a

function pick<T extends Drop>(tbl: T[]): T {
  const tot = tbl.reduce((s, d) => s + d.weight, 0)
  let r = rand(tot)
  for (const d of tbl) { if ((r -= d.weight) < 0) return d }
  return tbl[tbl.length - 1]
}

// Unnoted items table (all laps, one roll if "inventory slot" assumed true)
const UNNOTED: Drop[] = [
  { id: 'blighted_anglerfish_un',     weight: 5, qty: [1, 1], gp: 309  },
  { id: 'blighted_manta_ray_un',      weight: 5, qty: [1, 1], gp: 576  },
  { id: 'blighted_karambwan_un',      weight: 5, qty: [1, 1], gp: 156  },
  { id: 'blighted_super_restore4_un', weight: 1, qty: [1, 1], gp: 6055 },
]

// Per-bracket NOTED SUPPLY tables
const SUP_B1: Drop[] = [
  { id: 'blighted_anglerfish',     weight: 8, qty: [ 3,  6] as [number, number], gp: 309 },
  { id: 'blighted_manta_ray',      weight: 8, qty: [ 3,  6] as [number, number], gp: 576 },
  { id: 'blighted_karambwan',      weight: 8, qty: [ 3,  6] as [number, number], gp: 156 },
  { id: 'blighted_super_restore4', weight: 7, qty: [ 1,  2] as [number, number], gp: 6055 },
]

const SUP_B2 = SUP_B1.map(d => ({ ...d, qty: [6, 11] as [number, number] }))
const SUP_B3 = SUP_B1.map(d => ({ ...d, qty: [10, 16] as [number, number] }))
const SUP_B4 = SUP_B1.map(d => ({ ...d, qty: [14, 20] as [number, number] }))

// Per-bracket NOTED ARMOR tables
const ARM_B1: Drop[] = [
  { id: 'adamant_platebody', weight: 2, qty: [1, 1] as [number, number], gp:  9612 },
  { id: 'rune_med_helm',     weight: 2, qty: [1, 1] as [number, number], gp: 11221 },
  { id: 'adamant_full_helm', weight: 1, qty: [1, 1] as [number, number], gp:  1850 },
  { id: 'adamant_platelegs', weight: 1, qty: [1, 1] as [number, number], gp:  3597 },
  { id: 'mithril_chainbody', weight: 1, qty: [1, 1] as [number, number], gp:  1012 },
  { id: 'mithril_platelegs', weight: 1, qty: [1, 1] as [number, number], gp:  1391 },
  { id: 'mithril_plateskirt',weight: 1, qty: [1, 1] as [number, number], gp:  1427 },
  { id: 'steel_platebody',   weight: 1, qty: [1, 1] as [number, number], gp:   909 },
]

const ARM_B2: Drop[] = [
  { id: 'adamant_full_helm', weight: 1, qty: [1, 1] as [number, number], gp:  1850 },
  { id: 'adamant_platebody', weight: 1, qty: [1, 1] as [number, number], gp:  9612 },
  { id: 'adamant_platelegs', weight: 1, qty: [1, 1] as [number, number], gp:  3597 },
  { id: 'mithril_chainbody', weight: 1, qty: [1, 1] as [number, number], gp:  1012 },
  { id: 'mithril_platelegs', weight: 1, qty: [1, 1] as [number, number], gp:  1391 },
  { id: 'mithril_plateskirt',weight: 1, qty: [1, 1] as [number, number], gp:  1427 },
  { id: 'rune_chainbody',    weight: 1, qty: [1, 1] as [number, number], gp: 29641 },
  { id: 'rune_kiteshield',   weight: 1, qty: [1, 1] as [number, number], gp: 32299 },
  { id: 'rune_med_helm',     weight: 1, qty: [1, 1] as [number, number], gp: 11221 },
]

const ARM_B3: Drop[] = [
  { id: 'rune_chainbody',    weight: 2, qty: [1, 1] as [number, number], gp: 29641 },
  { id: 'rune_kiteshield',   weight: 2, qty: [1, 1] as [number, number], gp: 32299 },
  { id: 'adamant_full_helm', weight: 1, qty: [1, 1] as [number, number], gp:  1850 },
  { id: 'adamant_platebody', weight: 1, qty: [1, 1] as [number, number], gp:  9612 },
  { id: 'adamant_platelegs', weight: 1, qty: [1, 1] as [number, number], gp:  3597 },
  { id: 'mithril_platelegs', weight: 1, qty: [1, 1] as [number, number], gp:  1391 },
  { id: 'mithril_plateskirt',weight: 1, qty: [1, 1] as [number, number], gp:  1427 },
  { id: 'rune_med_helm',     weight: 1, qty: [1, 1] as [number, number], gp: 11221 },
]

const ARM_B4: Drop[] = [
  { id: 'rune_chainbody',    weight: 6, qty: [1, 1] as [number, number], gp: 29641 },
  { id: 'rune_kiteshield',   weight: 6, qty: [1, 1] as [number, number], gp: 32299 },
  { id: 'adamant_platebody', weight: 2, qty: [1, 1] as [number, number], gp:  9612 },
  { id: 'rune_med_helm',     weight: 2, qty: [1, 1] as [number, number], gp: 11221 },
  { id: 'adamant_full_helm', weight: 1, qty: [1, 1] as [number, number], gp:  1850 },
  { id: 'adamant_platelegs', weight: 1, qty: [1, 1] as [number, number], gp:  3597 },
  { id: 'mithril_platelegs', weight: 1, qty: [1, 1] as [number, number], gp:  1391 },
  { id: 'mithril_plateskirt',weight: 1, qty: [1, 1] as [number, number], gp:  1427 },
]

// Bracket picker
const BRACKETS = [
  { min: 1,  max: 15,  sup: SUP_B1, arm: ARM_B1 },
  { min: 16, max: 30,  sup: SUP_B2, arm: ARM_B2 },
  { min: 31, max: 60,  sup: SUP_B3, arm: ARM_B3 },
  { min: 61, max: Infinity, sup: SUP_B4, arm: ARM_B4 },
] as const

const getBracket = (lap: number) => BRACKETS.find(b => lap >= b.min && lap <= b.max)!

export function WildernessAgilitySimulator() {
  const [calculationType, setCalculationType] = useState<'levels' | 'laps'>('levels')
  const [startLevel, setStartLevel] = useState('')
  const [endLevel, setEndLevel] = useState('')
  const [lapCount, setLapCount] = useState('')
  const [payFee, setPayFee] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SimulationResults | null>(null)

  const validateInputs = (): boolean => {
    if (calculationType === 'levels') {
      const start = parseInt(startLevel)
      const end = parseInt(endLevel)
      
      if (isNaN(start) || start < 1 || start > 98) {
        setError("Start level must be between 1 and 98")
        return false
      }
      if (isNaN(end) || end <= start || end > 99) {
        setError("End level must be higher than start level and not exceed 99")
        return false
      }
    } else {
      const laps = parseInt(lapCount)
      if (isNaN(laps) || laps < 1 || laps > 100000) {
        setError("Number of laps must be between 1 and 100,000")
        return false
      }
    }
    setError(null)
    return true
  }

  const simulate = () => {
    if (!validateInputs()) return

    let totalLaps: number
    let xpNeeded: number

    if (calculationType === 'levels') {
      const start = parseInt(startLevel)
      const end = parseInt(endLevel)
      const startXP = getXPForLevel(start)
      const endXP = getXPForLevel(end)
      xpNeeded = endXP - startXP
      totalLaps = Math.ceil(xpNeeded / XP_PER_LAP)
    } else {
      totalLaps = parseInt(lapCount)
      xpNeeded = totalLaps * XP_PER_LAP
    }

    // Calculate time needed
    const timeHours = totalLaps / LAPS_PER_HOUR
    const timeMinutes = Math.round((timeHours - Math.floor(timeHours)) * 60)

    // Simulate loot
    const lootMap = new Map<string, { qty: number; gp: number }>()
    let clues = 0
    let tickets = 0
    let lootGp = 0

    function addLoot(d: Drop, q: number) {
      const line = lootMap.get(d.id) ?? { qty: 0, gp: 0 }
      line.qty += q
      line.gp += q * d.gp
      lootMap.set(d.id, line)
      lootGp += q * d.gp
    }

    for (let lap = 1; lap <= totalLaps; lap++) {
      if (payFee) {
        // Noted supplies
        const s = pick(getBracket(lap).sup)
        const sQty = rInt(...s.qty)
        addLoot(s, sQty)

        // Noted armour
        const a = pick(getBracket(lap).arm)
        const aQty = rInt(...a.qty)
        addLoot(a, aQty)

        // Un-noted roll (always, since we assume an inventory slot)
        const u = pick(UNNOTED)
        addLoot(u, 1) // always qty 1

        // Clue roll
        if (rand() < 1 / CLUE_ODDS) clues++
      }
      // Ticket (always, gp 0)
      tickets++
    }

    const lootBreakdown = Array.from(lootMap, ([id, { qty, gp }]) => ({
      id,
      name: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      qty,
      gp
    }))

    // Calculate total GP (loot - fee)
    const totalGp = payFee ? lootGp - DISPENSER_FEE : 0

    setResults({
      totalXP: xpNeeded,
      totalLaps,
      timeHours: Math.floor(timeHours),
      timeMinutes,
      tickets,
      clues,
      lootBreakdown,
      lootGp,
      totalGp,
      lootingBag: payFee
    })
  }

  const getXPForLevel = (level: number): number => {
    const XP_TABLE = [
      0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470,
      5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473,
      30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660,
      136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254,
      547953, 605032, 668051, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808,
      1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831,
      6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431
    ]
    return XP_TABLE[level - 1]
  }

  const handleClear = () => {
    setStartLevel('')
    setEndLevel('')
    setLapCount('')
    setPayFee(false)
    setError(null)
    setResults(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="rs-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-rs-gold text-2xl">Wilderness Agility Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pb-4 pt-2">
          <div className="text-xs text-rs-gold/80 italic mb-1">
            Simulate training at the Wilderness Agility Course.
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
                setCalculationType(value as 'levels' | 'laps')
                setError(null)
              }}
              className="flex gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="levels" id="levels" />
                <Label htmlFor="levels" className="text-rs-gold">Level Range</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="laps" id="laps" />
                <Label htmlFor="laps" className="text-rs-gold">Exact Laps</Label>
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
                  onChange={(e) => setStartLevel(e.target.value)}
                  className="rs-input h-9 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endLevel" className="text-rs-gold text-lg">End Level</Label>
                <Input
                  id="endLevel"
                  type="number"
                  min="1"
                  max="99"
                  value={endLevel}
                  onChange={(e) => setEndLevel(e.target.value)}
                  className="rs-input h-9 text-base"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="lapCount" className="text-rs-gold text-lg">Number of Laps</Label>
              <Input
                id="lapCount"
                type="number"
                min="1"
                max="100000"
                value={lapCount}
                onChange={(e) => setLapCount(e.target.value)}
                className="rs-input h-9 text-base"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="payFee"
              checked={payFee}
              onCheckedChange={(checked) => setPayFee(checked as boolean)}
            />
            <Label htmlFor="payFee" className="text-rs-gold text-base">
              Pay 150,000 gp for dispenser rewards
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={handleClear}
              variant="outline"
              className="rs-button h-8 px-3 text-sm"
            >
              Clear
            </Button>
            <Button
              onClick={simulate}
              className="rs-button h-8 px-3 text-sm"
            >
              Simulate
            </Button>
          </div>

          {results && (
            <div className="border-t border-rs-brown/30 pt-6">
              <div className="space-y-4">
                <Label className="text-rs-gold text-lg">Results</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm">Total XP</div>
                    <div className="text-rs-gold text-xl font-semibold">{results.totalXP.toLocaleString()}</div>
                  </div>
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm">Total Laps</div>
                    <div className="text-rs-gold text-xl font-semibold">{results.totalLaps.toLocaleString()}</div>
                  </div>
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm">Time Required</div>
                    <div className="text-rs-gold text-xl font-semibold">{results.timeHours}h {results.timeMinutes}m</div>
                  </div>
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm">Tickets</div>
                    <div className="text-rs-gold text-xl font-semibold">{results.tickets.toLocaleString()}</div>
                  </div>
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm">Clue Scrolls</div>
                    <div className="text-rs-gold text-xl font-semibold">{results.clues.toLocaleString()}</div>
                  </div>
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm">Total GP</div>
                    <div className="text-rs-gold text-xl font-semibold">{results.totalGp.toLocaleString()}</div>
                  </div>
                </div>

                {payFee && results.lootBreakdown.length > 0 && (
                  <div className="bg-[#4A3C31] border-4 border-[#2D2319] rounded-lg p-6 relative">
                    <div className="flex items-center mb-4 gap-2">
                      <h3 className="text-rs-gold text-2xl">Loot Obtained</h3>
                      <span className="text-rs-gold/80 text-base font-normal">from {results.totalLaps.toLocaleString()} laps</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {results.lootBreakdown.map((item) => (
                        <div key={item.id} className="relative bg-[#2D2319] rounded p-2 flex flex-col items-center">
                          <div className="relative">
                            <img
                              src={`/images/items/${item.id}.png`}
                              alt={item.name}
                              className="w-12 h-12"
                              onError={(e) => {
                                e.currentTarget.src = '/images/items/placeholder.png'
                              }}
                            />
                            <div className="absolute -bottom-1 -right-1 bg-[#2D2319] text-rs-gold px-1.5 rounded text-sm border border-rs-gold/30">
                              {item.qty.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center text-rs-gold text-sm mt-1">
                            {item.name}
                          </div>
                          <div className="text-center text-rs-gold/80 text-xs">
                            {item.gp.toLocaleString()} gp
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-rs-brown/10 rounded p-3">
                  <div className="text-rs-gold/80 text-sm font-semibold mb-2">Course Information</div>
                  <div className="text-rs-gold/80 text-xs space-y-2">
                    <p>• Located in the Wilderness (Level 52)</p>
                    <p>• 45 seconds per lap</p>
                    <p>• Includes 2:10 bank time per hour</p>
                    <p>• Max XP with bonus tickets: 65,900 XP/hr</p>
                    <p>• 10% chance for a ticket per lap</p>
                    <p>• 1 in 40 chance for a clue scroll per lap</p>
                    <p>• Requires 52 Agility</p>
                    <p>• 150,000 GP fee to use the dispenser</p>
                    <p>• Each lap provides:</p>
                    <p className="ml-4">- One roll for noted resources</p>
                    <p className="ml-4">- One roll for noted armor</p>
                    <p className="ml-4">- One roll for unnoted supplies</p>
                    <p>• Loot multiplier increases at:</p>
                    <p className="ml-4">- 1-15 laps: 1x value</p>
                    <p className="ml-4">- 16-30 laps: 2x value</p>
                    <p className="ml-4">- 31-60 laps: 3x value</p>
                    <p className="ml-4">- 61+ laps: 4x value</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 