"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface SimulationResults {
  totalXP: number
  totalLaps: number
  timeHours: number
  timeMinutes: number
  marksOfGrace: number
  gpValue: number
}

export function WildernessAgilitySimulator() {
  const [startLevel, setStartLevel] = useState('')
  const [endLevel, setEndLevel] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SimulationResults | null>(null)

  const validateInputs = (): boolean => {
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
    setError(null)
    return true
  }

  const simulate = () => {
    if (!validateInputs()) return

    const start = parseInt(startLevel)
    const end = parseInt(endLevel)

    // Constants for Wilderness Agility Course
    const XP_PER_LAP = 571.4
    const LAPS_PER_HOUR = 83 // 45 seconds per lap + 2:10 bank time per hour
    const MARKS_PER_HOUR = 8 // Average marks of grace per hour
    const MARK_PRICE = 30000 // Current GE price for mark of grace

    // Calculate XP needed
    const startXP = getXPForLevel(start)
    const endXP = getXPForLevel(end)
    const xpNeeded = endXP - startXP

    // Calculate laps needed
    const lapsNeeded = Math.ceil(xpNeeded / XP_PER_LAP)

    // Calculate time needed
    const timeHours = lapsNeeded / LAPS_PER_HOUR
    const timeMinutes = Math.round((timeHours - Math.floor(timeHours)) * 60)

    // Calculate marks of grace
    const marksOfGrace = Math.floor(timeHours * MARKS_PER_HOUR)
    const gpValue = marksOfGrace * MARK_PRICE

    setResults({
      totalXP: xpNeeded,
      totalLaps: lapsNeeded,
      timeHours: Math.floor(timeHours),
      timeMinutes,
      marksOfGrace,
      gpValue
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
                    <div className="text-rs-gold/80 text-sm">Marks of Grace</div>
                    <div className="text-rs-gold text-xl font-semibold">{results.marksOfGrace.toLocaleString()}</div>
                  </div>
                  <div className="bg-rs-brown/10 rounded p-3">
                    <div className="text-rs-gold/80 text-sm">GP Value</div>
                    <div className="text-rs-gold text-xl font-semibold">{results.gpValue.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-rs-brown/10 rounded p-3">
                  <div className="text-rs-gold/80 text-sm font-semibold mb-2">Course Information</div>
                  <div className="text-rs-gold/80 text-xs space-y-2">
                    <p>• Located in the Wilderness (Level 52)</p>
                    <p>• 45 seconds per lap</p>
                    <p>• Includes 2:10 bank time per hour</p>
                    <p>• Max XP with bonus tickets: 65,900 XP/hr</p>
                    <p>• Average of 8 marks of grace per hour</p>
                    <p>• Requires 52 Agility</p>
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