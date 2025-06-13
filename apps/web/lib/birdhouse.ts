export type BirdhouseTier =
  | 'regular'
  | 'oak'
  | 'willow'
  | 'teak'
  | 'maple'
  | 'mahogany'
  | 'yew'
  | 'magic'
  | 'redwood';

export interface LootDrop {
  id: string;
  qty: number;
}

// Seed-nest chance per Hunter level
function seedNestChance(level: number): number {
  const low = 1;     // raw = 1   → 0.39 %
  const high = 201;  // raw = 201 → 78.52 %
  const raw = Math.floor(low * (99 - level) / 98
    + high * (level - 1) / 98
    + 0.5);         // round to nearest int
  return raw / 2.56; // % chance at this level
}

// Nest-roll success chance (tier × 6 level buckets)
const BUCKET_MULT: number[] = [0.50, 0.60, 0.70, 0.80, 0.90, 1.00];

const MAX_SUCCESS = {
  regular: 5.0,
  oak: 7.5,
  willow: 10.0,
  teak: 12.5,
  maple: 15.0,
  mahogany: 17.5,
  yew: 20.0,
  magic: 22.5,
  redwood: 25.0,
} as const;

const NEST_SUCCESS: Record<BirdhouseTier, number[]> = Object.fromEntries(
  Object.entries(MAX_SUCCESS).map(([tier, max]) => [
    tier,
    BUCKET_MULT.map(m => +(max * m).toFixed(2)),
  ])
) as Record<BirdhouseTier, number[]>;

function levelBucket(level: number): number {
  if (level < 50) return 0;
  const idx = Math.floor((level - 50) / 10) + 1; // 50-59→1, … >=90→5
  return Math.min(idx, 5);
}

// Other-nest weights and rabbit-foot tweak
const BASE_OTHER = { empty: 65, ring: 32, egg: 3 } as const;

function otherNestWeights(foot: boolean) {
  if (!foot) return BASE_OTHER;
  const diverted = BASE_OTHER.empty * 0.05; // 5% of empty
  return {
    empty: BASE_OTHER.empty - diverted,
    ring: BASE_OTHER.ring + diverted / 2,
    egg: BASE_OTHER.egg + diverted / 2,
  };
}

// Seed-nest drop table
type SeedEntry = { id: string; weight: number };

const SEED_TABLE: SeedEntry[] = [
  { id: 'acorn', weight: 214 },
  { id: 'apple_tree_seed', weight: 170 },
  { id: 'willow_seed', weight: 135 },
  { id: 'banana_tree_seed', weight: 108 },
  { id: 'orange_tree_seed', weight: 85 },
  { id: 'curry_tree_seed', weight: 68 },
  { id: 'maple_seed', weight: 54 },
  { id: 'pineapple_seed', weight: 42 },
  { id: 'papaya_tree_seed', weight: 34 },
  { id: 'yew_seed', weight: 27 },
  { id: 'palm_tree_seed', weight: 22 },
  { id: 'calquat_tree_seed', weight: 17 },
  { id: 'spirit_seed', weight: 11 },
  { id: 'dragonfruit_tree_seed', weight: 6 },
  { id: 'magic_seed', weight: 5 },
  { id: 'teak_seed', weight: 4 },
  { id: 'mahogany_seed', weight: 4 },
  { id: 'celastrus_seed', weight: 3 },
  { id: 'redwood_tree_seed', weight: 2 },
];

const SEED_TOTAL = 1011;

// Fixed loot per bird-house tier
const FIXED_LOOT: Record<BirdhouseTier, { meat: number; feathers: number }> = {
  regular: { meat: 10, feathers: 30 },
  oak: { meat: 10, feathers: 30 },
  willow: { meat: 10, feathers: 40 },
  teak: { meat: 10, feathers: 40 },
  maple: { meat: 10, feathers: 50 },
  mahogany: { meat: 10, feathers: 50 },
  yew: { meat: 10, feathers: 60 },
  magic: { meat: 10, feathers: 60 },
  redwood: { meat: 10, feathers: 60 },
};

// Helper function for weighted random selection
function weightedRandom<T>(entries: { item: T; weight: number }[], rng: () => number): T {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let random = rng() * totalWeight;
  
  for (const entry of entries) {
    random -= entry.weight;
    if (random <= 0) return entry.item;
  }
  
  return entries[entries.length - 1].item;
}

// Helper function to pick a seed from the seed table
function pickSeed(rng: () => number): string {
  const entries = SEED_TABLE.map(seed => ({ item: seed.id, weight: seed.weight }));
  return weightedRandom(entries, rng);
}

export function collectBirdhouse(
  hunterLevel: number,
  tier: BirdhouseTier,
  wearingFoot: boolean,
  rng: () => number = Math.random
): LootDrop[] {
  // Validate inputs
  if (hunterLevel < 1 || hunterLevel > 99) {
    throw new RangeError('Hunter level must be between 1 and 99');
  }
  if (!Object.keys(MAX_SUCCESS).includes(tier)) {
    throw new RangeError('Invalid birdhouse tier');
  }

  const loot: LootDrop[] = [];

  // 1. Seed-nest roll
  if (rng() < seedNestChance(hunterLevel) / 100) {
    loot.push({ id: pickSeed(rng), qty: 1 });
  }

  // 2. Ten "other-nest" rolls
  const nestSuccess = NEST_SUCCESS[tier][levelBucket(hunterLevel)] / 100;
  const weights = otherNestWeights(wearingFoot);
  const otherNestEntries = [
    { item: 'empty_nest', weight: weights.empty },
    { item: 'ring_nest', weight: weights.ring },
    { item: 'egg_nest', weight: weights.egg },
  ];

  for (let i = 0; i < 10; i++) {
    if (rng() < nestSuccess) {
      const nestType = weightedRandom(otherNestEntries, rng);
      loot.push({ id: nestType, qty: 1 });
    }
  }

  // 3. Fixed loot
  const fixed = FIXED_LOOT[tier];
  loot.push({ id: 'raw_bird_meat', qty: fixed.meat });
  loot.push({ id: 'feather', qty: fixed.feathers });
  loot.push({ id: 'clockwork', qty: 1 });

  return loot;
} 