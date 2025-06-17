"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

interface AgilityCourse {
  name: string
  level: number
  xp: number
  xpPerHour: number
  lapsPerHour?: number
  recommended?: boolean
  notes?: string
}

// Recommended training methods
const RECOMMENDED_TRAINING = [
  { name: "Questing", level: 1, endLevel: 33 },
  { name: "Brimhaven Agility Arena", level: 20, endLevel: 47 },
  { name: "Wilderness Agility Course", level: 47, endLevel: 62 },
  { name: "Hallowed Sepulchre", level: 62, endLevel: 99 }
] as const

// Agility courses with their XP rates and requirements
const AGILITY_COURSES = {
  rooftop: [
    { 
      name: "Gnome Stronghold", 
      level: 1, 
      xp: 39.5, 
      lapsPerHour: 120, 
      xpPerHour: 4740,
      notes: "Located in the Tree Gnome Stronghold. Wiki: https://oldschool.runescape.wiki/w/Gnome_Stronghold_Agility_Course"
    },
    { 
      name: "Draynor Village", 
      level: 10, 
      xp: 79, 
      lapsPerHour: 120, 
      xpPerHour: 9480,
      notes: "9,000-10,000 XP/hr. 38 laps per hour. Wiki: https://oldschool.runescape.wiki/w/Draynor_Village_rooftop_course"
    },
    { 
      name: "Al Kharid", 
      level: 20, 
      xp: 79, 
      lapsPerHour: 120, 
      xpPerHour: 9480,
      notes: "11,000-12,000 XP/hr. 10.4-11.4 laps per hour. Wiki: https://oldschool.runescape.wiki/w/Al_Kharid_rooftop_course"
    },
    { 
      name: "Varrock", 
      level: 30, 
      xp: 125, 
      lapsPerHour: 120, 
      xpPerHour: 15000,
      notes: "11,000-14,000 XP/hr. 8.4-10.8 laps per hour. Wiki: https://oldschool.runescape.wiki/w/Varrock_rooftop_course"
    },
    { 
      name: "Canifis", 
      level: 40, 
      xp: 175, 
      xpPerHour: 24000, 
      lapsPerHour: 137,
      notes: "14,000-17,000 XP/hr. 12.8-15.5 laps per hour. High marks of grace rate even after level 60. Wiki: https://oldschool.runescape.wiki/w/Canifis_rooftop_course"
    },
    { 
      name: "Falador", 
      level: 50, 
      xp: 180, 
      xpPerHour: 25000, 
      lapsPerHour: 139,
      notes: "29,000-34,000 XP/hr. 9.7-11.3 laps per hour. Wiki: https://oldschool.runescape.wiki/w/Falador_rooftop_course"
    },
    { 
      name: "Seers' Village", 
      level: 60, 
      xp: 435, 
      xpPerHour: 38000, 
      lapsPerHour: 87,
      notes: "Hard diary: 50,000-56,000 XP/hr. No hard diary: 40,000-44,000 XP/hr. Hard diary required for fastest rates. Wiki: https://oldschool.runescape.wiki/w/Seers%27_Village_rooftop_course"
    },
    { 
      name: "Pollnivneach", 
      level: 70, 
      xp: 540, 
      xpPerHour: 42000, 
      lapsPerHour: 78,
      notes: "Hard diary: 53,000-58,000 XP/hr. No hard diary: 47,000-51,000 XP/hr. Hard Desert Diary required for fastest rates. Wiki: https://oldschool.runescape.wiki/w/Pollnivneach_rooftop_course"
    },
    { 
      name: "Rellekka", 
      level: 80, 
      xp: 780, 
      xpPerHour: 48000, 
      lapsPerHour: 62,
      notes: "Hard diary: 59,000-63,000 XP/hr. No hard diary: 50,000-53,000 XP/hr. Hard Fremennik Diary required for fastest rates. Wiki: https://oldschool.runescape.wiki/w/Rellekka_rooftop_course"
    },
    { 
      name: "Ardougne", 
      level: 90, 
      xp: 793, 
      xpPerHour: 49000, 
      lapsPerHour: 62,
      notes: "66,000-70,000 XP/hr. Elite diary: 20.9-22.1 laps/hr. No elite diary: 16.8-17.9 laps/hr. Elite Ardougne Diary grants more marks of grace. Wiki: https://oldschool.runescape.wiki/w/Ardougne_rooftop_course"
    },
  ] as AgilityCourse[],
  other: [
    { 
      name: "Questing", 
      level: 1, 
      xp: 0, 
      xpPerHour: 0, 
      recommended: true,
      notes: "Complete these quests for 19,700 XP: The Tourist Trap, Recruitment Drive, The Depths of Despair, and The Grand Tree"
    },
    { 
      name: "Brimhaven Agility Arena", 
      level: 1, 
      xp: 39.5, 
      xpPerHour: 20000, 
      recommended: true,
      notes: "Located in Brimhaven. Earn tickets to exchange for XP. Wiki: https://oldschool.runescape.wiki/w/Brimhaven_Agility_Arena"
    },
    { 
      name: "Wilderness Agility Course", 
      level: 52, 
      xp: 571.4, 
      xpPerHour: 47500, 
      lapsPerHour: 83, 
      recommended: true,
      notes: "45 seconds per lap. Includes 2:10 bank time per hour. Max XP with bonus tickets: 65,900 XP/hr. Wiki: https://oldschool.runescape.wiki/w/Wilderness_Agility_Course"
    },
    { 
      name: "Hallowed Sepulchre", 
      level: 52, 
      xp: 571, 
      xpPerHour: 60000, 
      lapsPerHour: 105,
      recommended: true,
      notes: "Located in Darkmeyer. Requires Sins of the Father quest. Recommended: 66 Thieving, 56 Construction, 54 Prayer, 7+ Magic, 62 Ranged. Use stamina potions for run energy. Private instance (200 hallowed marks) recommended for consistent trap rotations. Max XP: 102,000-105,000 XP/hr with looting, 105,000-108,000 XP/hr without looting. Profitable at 92 Agility (1.7M gp/hr). Wiki: https://oldschool.runescape.wiki/w/Hallowed_Sepulchre. Strategy Guide: https://oldschool.runescape.wiki/w/Hallowed_Sepulchre/Strategies"
    },
    { 
      name: "Agility Pyramid", 
      level: 30, 
      xp: 125, 
      xpPerHour: 15000,
      notes: "Located in the Kharidian Desert. Earn gold and XP. Wiki: https://oldschool.runescape.wiki/w/Agility_Pyramid"
    },
    { 
      name: "Ape Atoll Agility Course", 
      level: 48, 
      xp: 580, 
      xpPerHour: 45000,
      notes: "Located on Ape Atoll. Requires Monkey Madness I. Wiki: https://oldschool.runescape.wiki/w/Ape_Atoll_Agility_Course"
    },
    { 
      name: "Shayzien Advanced Agility Course", 
      level: 47, 
      xp: 580, 
      xpPerHour: 45000,
      notes: "Located in Shayzien. Requires 100% Shayzien favor. Wiki: https://oldschool.runescape.wiki/w/Shayzien_Advanced_Agility_Course"
    },
    { 
      name: "Colossal Wyrm Agility Course", 
      level: 30, 
      xp: 125, 
      xpPerHour: 15000,
      notes: "Located in the Wilderness. Wiki: https://oldschool.runescape.wiki/w/Colossal_Wyrm_Agility_Course"
    },
    { 
      name: "Werewolf Agility Course", 
      level: 60, 
      xp: 435, 
      xpPerHour: 38000,
      notes: "Located in Canifis. Requires partial completion of Creature of Fenkenstrain. Wiki: https://oldschool.runescape.wiki/w/Werewolf_Agility_Course"
    },
    { 
      name: "Prif Agility Course", 
      level: 77, 
      xp: 780, 
      xpPerHour: 48000,
      notes: "Located in Prifddinas. Requires completion of Song of the Elves. Wiki: https://oldschool.runescape.wiki/w/Prifddinas_Agility_Course"
    },
  ] as AgilityCourse[]
} as const

interface CalculationResults {
  totalXP: number
  timeHours: number
  timeMinutes: number
  lapsNeeded: number
  segments: Array<{
    startLevel: number
    endLevel: number
    course: AgilityCourse
    xp: number
    laps: number
    timeHours: number
    timeMinutes: number
  }>
}

export function AgilityCalculator() {
  const [calculationType, setCalculationType] = useState<'levels' | 'xp'>('levels')
  const [startLevel, setStartLevel] = useState('')
  const [endLevel, setEndLevel] = useState('')
  const [targetXP, setTargetXP] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [segments, setSegments] = useState<Array<{
    id: string
    startLevel: number
    endLevel: number
    course: AgilityCourse
  }>>([])
  const [levelWarnings, setLevelWarnings] = useState<{ [key: string]: string }>({})

  const getBestCourseForLevel = (level: number) => {
    const allCourses = [...AGILITY_COURSES.rooftop, ...AGILITY_COURSES.other]
    return allCourses.reduce((prev, curr) => 
      curr.level <= level && (!prev || curr.xpPerHour > prev.xpPerHour) ? curr : prev
    )
  }

  const calculateSegment = (startLevel: number, endLevel: number, course: AgilityCourse) => {
    const startXP = XP_TABLE[startLevel - 1]
    const endXP = XP_TABLE[endLevel - 1]
    const xpNeeded = endXP - startXP

    // Skip calculations for questing
    if (course.name === "Questing") {
      return {
        startLevel,
        endLevel,
        course,
        xp: xpNeeded,
        laps: 0,
        timeHours: 0,
        timeMinutes: 0
      }
    }

    const xpPerHour = course.xpPerHour
    const timeHours = xpNeeded / xpPerHour
    const timeMinutes = Math.round((timeHours - Math.floor(timeHours)) * 60)
    const lapsNeeded = course.lapsPerHour ? Math.ceil(xpNeeded / course.xp) : 0

    return {
      startLevel,
      endLevel,
      course,
      xp: xpNeeded,
      laps: lapsNeeded,
      timeHours: Math.floor(timeHours),
      timeMinutes
    }
  }

  const addSegment = () => {
    const start = parseInt(startLevel)
    const end = parseInt(endLevel)
    if (segments.length >= end - start) return

    const lastSegment = segments[segments.length - 1]
    const newStartLevel = lastSegment ? lastSegment.endLevel + 1 : start
    const remainingLevels = end - newStartLevel
    const newEndLevel = Math.min(newStartLevel + Math.floor(remainingLevels / 2), end)
    
    const newSegment = {
      id: Math.random().toString(36).substr(2, 9),
      startLevel: newStartLevel,
      endLevel: newEndLevel,
      course: getBestCourseForLevel(newStartLevel)
    }

    // Update the last segment's end level if needed
    if (lastSegment) {
      updateSegment(lastSegment.id, { endLevel: newStartLevel - 1 })
    }

    setSegments([...segments, newSegment])
  }

  const updateSegment = (id: string, updates: Partial<{ startLevel: number; endLevel: number; course: AgilityCourse }>) => {
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
      if (index === 0 && level < parseInt(startLevel)) {
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
      if (index === segments.length - 1 && level > parseInt(endLevel)) {
        warnings[`${segmentId}-end`] = `End level cannot exceed ${endLevel}`
      }
    }

    setLevelWarnings(warnings)
    return Object.keys(warnings).length === 0
  }

  const createRecommendedSegments = () => {
    const start = parseInt(startLevel)
    const end = parseInt(endLevel)
    const newSegments: Array<{
      id: string
      startLevel: number
      endLevel: number
      course: AgilityCourse
    }> = []

    // Define the recommended level ranges
    const levelRanges = [
      { start: 1, end: 33, course: AGILITY_COURSES.other.find(c => c.name === "Questing") },
      { start: 33, end: 47, course: AGILITY_COURSES.other.find(c => c.name === "Brimhaven Agility Arena") },
      { start: 47, end: 62, course: AGILITY_COURSES.other.find(c => c.name === "Wilderness Agility Course") },
      { start: 62, end: 99, course: AGILITY_COURSES.other.find(c => c.name === "Hallowed Sepulchre") }
    ]

    // Create segments based on the level ranges
    levelRanges.forEach(range => {
      // Only create segments that fall within our start and end levels
      if (range.start <= end && range.end >= start && range.course) {
        const segmentStart = Math.max(start, range.start)
        const segmentEnd = Math.min(end, range.end)
        
        if (segmentStart <= segmentEnd) {
          newSegments.push({
            id: Math.random().toString(36).substr(2, 9),
            startLevel: segmentStart,
            endLevel: segmentEnd,
            course: range.course
          })
        }
      }
    })

    setSegments(newSegments)
  }

  useEffect(() => {
    setError(null)
    setSegments([])

    // Validate inputs
    if (calculationType === 'levels') {
      const start = startLevel ? parseInt(startLevel) : 0
      const end = endLevel ? parseInt(endLevel) : 0
      
      if (startLevel && endLevel) {
        if (start < 1 || start > 98) {
          setError("Start level must be between 1 and 98")
          setResults(null)
          return
        }
        if (end <= start || end > 99) {
          setError("End level must be higher than start level and not exceed 99")
          setResults(null)
          return
        }

        // Add initial segment
        const initialSegment = {
          id: Math.random().toString(36).substr(2, 9),
          startLevel: start,
          endLevel: end,
          course: getBestCourseForLevel(start)
        }
        setSegments([initialSegment])
      }
    } else {
      if (targetXP <= 0) {
        setError("Target XP must be greater than 0")
        setResults(null)
        return
      }
    }
  }, [calculationType, startLevel, endLevel, targetXP])

  useEffect(() => {
    if (segments.length === 0) return

    let totalXP = 0
    let totalTimeHours = 0
    let totalTimeMinutes = 0
    let totalLaps = 0

    const calculatedSegments = segments.map(segment => {
      const result = calculateSegment(segment.startLevel, segment.endLevel, segment.course)
      totalXP += result.xp
      totalTimeHours += result.timeHours
      totalTimeMinutes += result.timeMinutes
      totalLaps += result.laps
      return result
    })

    // Normalize minutes
    totalTimeHours += Math.floor(totalTimeMinutes / 60)
    totalTimeMinutes = totalTimeMinutes % 60

    setResults({
      totalXP,
      timeHours: totalTimeHours,
      timeMinutes: totalTimeMinutes,
      lapsNeeded: totalLaps,
      segments: calculatedSegments
    })
  }, [segments])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="rs-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-rs-gold text-2xl">Agility Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pb-4 pt-2">
          <div className="text-xs text-rs-gold/80 italic mb-1">
            Calculate XP and time needed for Agility training.
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
                  onChange={(e) => setStartLevel(e.target.value)}
                  className="rs-input h-9 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endLevel" className="text-rs-gold text-lg">End Level</Label>
                <Input
                  id="endLevel"
                  type="number"
                  min={startLevel ? parseInt(startLevel) + 1 : 2}
                  max="99"
                  value={endLevel}
                  onChange={(e) => setEndLevel(e.target.value)}
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

          {calculationType === 'levels' && (
            <div className="flex justify-end">
              <Button
                onClick={createRecommendedSegments}
                disabled={!startLevel || !endLevel}
                className="rs-button h-8 px-3 text-sm"
              >
                Create Recommended Plan
              </Button>
            </div>
          )}

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
                    disabled={!startLevel || !endLevel || segments.length >= (parseInt(endLevel) - parseInt(startLevel))}
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
                          <Label className="text-rs-gold text-sm">Course</Label>
                          <Select
                            value={segment.course.name}
                            onValueChange={(value) => {
                              const allCourses = [...AGILITY_COURSES.rooftop, ...AGILITY_COURSES.other]
                              const course = allCourses.find(c => c.name === value)
                              if (course) {
                                updateSegment(segment.id, { course })
                              }
                            }}
                          >
                            <SelectTrigger className="rs-input h-8 text-xs">
                              <SelectValue>
                                {segment.course.name} (Level {segment.course.level})
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] overflow-y-auto [&_[data-radix-select-item-indicator]]:hidden">
                              <div className="bg-rs-brown/95">
                                <SelectItem value="rooftop" disabled className="text-rs-gold font-semibold">
                                  Rooftop Courses
                                </SelectItem>
                              </div>
                              {AGILITY_COURSES.rooftop.map(course => (
                                <SelectItem 
                                  key={course.name} 
                                  value={course.name}
                                  className={`text-sm pl-4 data-[state=checked]:text-green-500 data-[state=checked]:bg-transparent ${course.level > segment.endLevel ? "opacity-50 cursor-not-allowed" : ""}`}
                                  disabled={course.level > segment.endLevel}
                                >
                                  {course.name} (Level {course.level})
                                </SelectItem>
                              ))}
                              <div className="bg-rs-brown/95 mt-2">
                                <SelectItem value="other" disabled className="text-rs-gold font-semibold">
                                  Other Courses
                                </SelectItem>
                              </div>
                              {AGILITY_COURSES.other.map(course => (
                                <SelectItem 
                                  key={course.name} 
                                  value={course.name}
                                  className={`text-sm pl-4 data-[state=checked]:text-green-500 data-[state=checked]:bg-transparent ${course.level > segment.endLevel ? "opacity-50 cursor-not-allowed" : ""}`}
                                  disabled={course.level > segment.endLevel}
                                >
                                  {course.name} (Level {course.level})
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
                                <div>XP: {results.segments[index].xp.toLocaleString()}</div>
                                {segment.course.name !== "Questing" && (
                                  <div>Laps: {results.segments[index].laps.toLocaleString()}</div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-rs-gold/80 text-xs font-semibold">Time Required</div>
                              <div className="grid grid-cols-1 gap-2 text-rs-gold/80 text-xs">
                                {segment.course.name === "Questing" ? (
                                  <div>Questing Time</div>
                                ) : (
                                  <div>{results.segments[index].timeHours}h {results.segments[index].timeMinutes}m</div>
                                )}
                              </div>
                            </div>
                          </div>
                          {segment.course.name === "Questing" && (
                            <div className="mt-2 p-2 bg-rs-brown/10 rounded border border-rs-brown/20">
                              <div className="text-rs-gold/80 text-xs font-semibold mb-1">Required Quests (19,700 XP)</div>
                              <ul className="text-rs-gold/80 text-xs space-y-1 list-disc list-inside">
                                <li>The Tourist Trap (use experience on Agility two times)</li>
                                <li>Recruitment Drive</li>
                                <li>The Depths of Despair</li>
                                <li>The Grand Tree</li>
                              </ul>
                            </div>
                          )}
                          {segment.course.name === "Wilderness Agility Course" && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-rs-gold/80 text-xs">Try this out!</span>
                              <Link
                                href="/tools/wilderness-agility-simulator"
                                className="text-white hover:text-rs-gold text-xs bg-rs-brown/10 px-3 py-1 rounded border-2 border-rs-gold/50 hover:border-rs-gold"
                              >
                                Open Simulator
                              </Link>
                            </div>
                          )}
                          {segment.course.notes && (
                            <div className="mt-2 p-2 bg-rs-brown/10 rounded border border-rs-brown/20">
                              <div className="text-rs-gold/80 text-xs font-semibold mb-1">Course Notes</div>
                              <div className="text-rs-gold/80 text-xs space-y-2">
                                <div>{segment.course.notes.split('. Wiki:')[0]}</div>
                                {segment.course.notes?.includes('Wiki:') && (
                                  <div className="flex gap-2 flex-wrap">
                                    {segment.course.notes.split('Wiki: ')[1].split('. Strategy Guide:').map((link, index) => (
                                      <a 
                                        key={index}
                                        href={link}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 text-xs"
                                      >
                                        {index === 0 ? 'View Wiki Guide' : 'View Strategy Guide'}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
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
                  <div className="text-rs-gold text-xl font-semibold">
                    {results?.totalXP.toLocaleString() ?? '0'}
                  </div>
                </div>
                <div className="bg-rs-brown/10 rounded p-3">
                  <div className="text-rs-gold/80 text-sm">Total Laps</div>
                  <div className="text-rs-gold text-xl font-semibold">
                    {results?.segments
                      .filter(s => s.course.name !== "Questing")
                      .reduce((sum, s) => sum + s.laps, 0)
                      .toLocaleString() ?? '0'}
                  </div>
                </div>
                <div className="bg-rs-brown/10 rounded p-3">
                  <div className="text-rs-gold/80 text-sm">Total Time</div>
                  <div className="text-rs-gold text-xl font-semibold">
                    {results ? (
                      <>
                        {results.segments
                          .filter(s => s.course.name !== "Questing")
                          .reduce((sum, s) => sum + s.timeHours, 0)}h {Math.round(
                            results.segments
                              .filter(s => s.course.name !== "Questing")
                              .reduce((sum, s) => sum + s.timeMinutes, 0)
                          )}m
                      </>
                    ) : (
                      '0h 0m'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 