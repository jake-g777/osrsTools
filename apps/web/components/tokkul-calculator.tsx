"use client"

import { useState, ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Items that can be bought with Tokkul
const PURCHASABLE_ITEMS = [
  { name: "Onyx", tokkul: 300000 },
  { name: "Obsidian Helmet", tokkul: 84480 },
  { name: "Obsidian platebody", tokkul: 126000 },
  { name: "Obsidian platelegs", tokkul: 100500 },
  { name: "Toktz-ket-xil", tokkul: 67500 },
  { name: "Obsidian cape", tokkul: 90000 },
  { name: "Toktz-xil-ek", tokkul: 37500 },
  { name: "Toktz-xil-ak", tokkul: 60000 },
  { name: "Tzhaar-ket-em", tokkul: 45000 },
  { name: "Tzhaar-ket-om", tokkul: 75001 },
  { name: "Toktz-xil-ul", tokkul: 375 },
  { name: "Toktz-mej-tal", tokkul: 52500 },
]

export function TokkulCalculator() {
  const [bankedTokkul, setBankedTokkul] = useState(0)
  const [bankedChaosRunes, setBankedChaosRunes] = useState(0)
  const [bankedDeathRunes, setBankedDeathRunes] = useState(0)
  const [hasDiary, setHasDiary] = useState(false)
  const [isIronman, setIsIronman] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})

  const getDiscountedPrice = (basePrice: number) => {
    return hasDiary ? Math.floor(basePrice * 0.867) : basePrice // 13.3% discount
  }

  const chaosRuneValue = hasDiary ? 31 : 13
  const deathRuneValue = hasDiary ? 63 : 27

  const bankedTotalTokkul = bankedTokkul + 
    (bankedChaosRunes * chaosRuneValue) + 
    (bankedDeathRunes * deathRuneValue)

  const totalCost = Object.entries(selectedItems)
    .filter(([_, selected]) => selected)
    .reduce((total, [itemName]) => {
      const item = PURCHASABLE_ITEMS.find(i => i.name === itemName)
      return total + (item ? getDiscountedPrice(item.tokkul) : 0)
    }, 0)

  const tokkulRequired = Math.max(0, totalCost - bankedTotalTokkul)
  const chaosRunesRequired = Math.ceil(tokkulRequired / chaosRuneValue)
  const deathRunesRequired = Math.ceil(tokkulRequired / deathRuneValue)

  return (
    <Card className="rs-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-rs-gold">Tokkul Calculator</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="diary"
              checked={hasDiary}
              onCheckedChange={(checked) => setHasDiary(checked as boolean)}
            />
            <Label htmlFor="diary" className="text-rs-gold">
              Karamja Diary
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ironman"
              checked={isIronman}
              onCheckedChange={(checked) => setIsIronman(checked as boolean)}
            />
            <Label htmlFor="ironman" className="text-rs-gold">
              Ironman
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-rs-gold font-semibold">Items to Purchase</h3>
          <div className="grid grid-cols-2 gap-2">
            {PURCHASABLE_ITEMS.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <Checkbox
                  id={item.name}
                  checked={selectedItems[item.name] || false}
                  onCheckedChange={(checked) => {
                    setSelectedItems(prev => ({
                      ...prev,
                      [item.name]: checked as boolean
                    }))
                  }}
                />
                <div className="flex items-center space-x-2">
                  <img 
                    src={`/images/items/${item.name.toLowerCase().replace(/-/g, '_')}.png`}
                    alt={item.name}
                    className="w-6 h-6"
                    onError={(e) => {
                      e.currentTarget.src = '/images/items/placeholder.png'
                    }}
                  />
                  <Label htmlFor={item.name} className="text-rs-gold">
                    {item.name} ({getDiscountedPrice(item.tokkul).toLocaleString()} Tokkul)
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-rs-stone">
          <h3 className="text-rs-gold font-semibold">Banked Resources</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/items/tokkul.png"
                  alt="Tokkul"
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = '/images/items/placeholder.png'
                  }}
                />
                <Label htmlFor="bankedTokkul" className="text-rs-gold">Banked Tokkul</Label>
              </div>
              <Input
                id="bankedTokkul"
                type="number"
                min="0"
                value={bankedTokkul}
                onChange={(e) => setBankedTokkul(Math.max(0, parseInt(e.target.value) || 0))}
                className="rs-input w-32"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/items/chaos_rune.png"
                  alt="Chaos Rune"
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = '/images/items/placeholder.png'
                  }}
                />
                <Label htmlFor="bankedChaosRunes" className="text-rs-gold">Banked Chaos Runes</Label>
              </div>
              <Input
                id="bankedChaosRunes"
                type="number"
                min="0"
                value={bankedChaosRunes}
                onChange={(e) => setBankedChaosRunes(Math.max(0, parseInt(e.target.value) || 0))}
                className="rs-input w-32"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/items/death_rune.png"
                  alt="Death Rune"
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = '/images/items/placeholder.png'
                  }}
                />
                <Label htmlFor="bankedDeathRunes" className="text-rs-gold">Banked Death Runes</Label>
              </div>
              <Input
                id="bankedDeathRunes"
                type="number"
                min="0"
                value={bankedDeathRunes}
                onChange={(e) => setBankedDeathRunes(Math.max(0, parseInt(e.target.value) || 0))}
                className="rs-input w-32"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-rs-stone">
          <h3 className="text-rs-gold font-semibold">Results</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-rs-gold">Total Tokkul Cost:</span>
              <span className="text-rs-gold">{totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rs-gold">Banked Total Tokkul:</span>
              <span className="text-rs-gold">{bankedTotalTokkul.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rs-gold">Tokkul Required:</span>
              <span className="text-rs-gold">{tokkulRequired.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rs-gold">Chaos Runes Required:</span>
              <span className="text-rs-gold">{chaosRunesRequired.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rs-gold">Death Runes Required:</span>
              <span className="text-rs-gold">{deathRunesRequired.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 