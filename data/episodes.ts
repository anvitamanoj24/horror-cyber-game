export interface Episode {
  id: number
  level: number
  episodeInLevel: number
  question: string
  answer: string
  hint: string
  flavor: string
  timerSeconds: number
  puzzleType: 'lateral' | 'morse' | 'hidden' | 'logic' | 'riddle'
}

export interface Level {
  id: number
  title: string
  room: string
  theme: string
  fragment: string
  fragmentDesc: string
  masterRiddle: string
  masterAnswer: string
  masterHint: string
  color: string
  episodes: Episode[]
}

// ─────────────────────────────────────────────────────────────────
// LEVEL 1 — CHIPSYNC (VLSI & Physical Design)
// ─────────────────────────────────────────────────────────────────
const level1Episodes: Episode[] = [
  {
    id: 1, level: 1, episodeInLevel: 1,
    flavor: "A silicon wafer sits on the bench, pale and cold. The design begins here.",
    question: "In VLSI physical design, the step where circuit elements are assigned to specific locations on the chip is called?",
    answer: "placement",
    hint: "It comes after floorplanning. Before routing.",
    timerSeconds: 20, puzzleType: 'riddle'
  },
  {
    id: 2, level: 1, episodeInLevel: 2,
    flavor: "Wires glow faintly across the die. The ghost follows the metal layers.",
    question: "The process of connecting all placed cells with metal wires according to the netlist is called?",
    answer: "routing",
    hint: "Global then detailed. The final connections.",
    timerSeconds: 20, puzzleType: 'riddle'
  },
  {
    id: 3, level: 1, episodeInLevel: 3,
    flavor: "The floorplan is drawn in blood on the lab floor.",
    question: "In physical design, dividing the chip area into regions and assigning blocks to those regions is called?",
    answer: "floorplanning",
    hint: "The very first step of physical design.",
    timerSeconds: 20, puzzleType: 'riddle'
  },
  {
    id: 4, level: 1, episodeInLevel: 4,
    flavor: "A timing report blinks on the screen. Something is late.",
    question: "The minimum time required for data to travel from one flip-flop to another is constrained by what kind of path analysis?",
    answer: "setup timing",
    hint: "Data must arrive BEFORE the clock edge. Setup or hold?",
    timerSeconds: 25, puzzleType: 'logic'
  },
  {
    id: 5, level: 1, episodeInLevel: 5,
    flavor: "The chip overheats. The ghost whispers about power density.",
    question: "In VLSI, IR drop refers to voltage drop caused by resistance in the?",
    answer: "power grid",
    hint: "Current × Resistance = Voltage drop. Happens in the distribution network.",
    timerSeconds: 20, puzzleType: 'logic'
  },
  {
    id: 6, level: 1, episodeInLevel: 6,
    flavor: "A DRC error lights up the screen in red.",
    question: "DRC in physical design stands for Design Rule ___?",
    answer: "check",
    hint: "It verifies minimum spacing, width, and enclosure rules.",
    timerSeconds: 15, puzzleType: 'riddle'
  },
  {
    id: 7, level: 1, episodeInLevel: 7,
    flavor: "The netlist matches the layout. The ghost is satisfied.",
    question: "LVS in chip verification stands for Layout Versus ___?",
    answer: "schematic",
    hint: "Checks that your physical layout matches the original circuit.",
    timerSeconds: 15, puzzleType: 'riddle'
  },
  {
    id: 8, level: 1, episodeInLevel: 8,
    flavor: "Clock trees branch like veins through the silicon.",
    question: "The process of distributing the clock signal evenly to all flip-flops to minimize skew is called Clock Tree ___?",
    answer: "synthesis",
    hint: "CTS — balancing the clock across the chip.",
    timerSeconds: 20, puzzleType: 'riddle'
  },
  {
    id: 9, level: 1, episodeInLevel: 9,
    flavor: "A filler cell is placed where nothing else fits.",
    question: "Cells inserted between standard cells to fill gaps and maintain N-well continuity are called?",
    answer: "filler cells",
    hint: "They have no logic function. Just fill space.",
    timerSeconds: 20, puzzleType: 'lateral'
  },
  {
    id: 10, level: 1, episodeInLevel: 10,
    flavor: "The tape-out button glows. One final check remains.",
    question: "The final physical verification step that checks manufacturability — spacing, width, antenna rules — before sending to the foundry is called?",
    answer: "drc",
    hint: "Design Rule Check. The last gate before fabrication.",
    timerSeconds: 20, puzzleType: 'riddle'
  },
]

// ─────────────────────────────────────────────────────────────────
// LEVELS 2, 3, 4 — Placeholder (to be filled by admin)
// ─────────────────────────────────────────────────────────────────
const placeholderEpisodes = (level: number, offset: number): Episode[] =>
  Array.from({ length: 10 }, (_, i) => ({
    id: offset + i + 1,
    level,
    episodeInLevel: i + 1,
    flavor: "This room is sealed. The admin will unlock it when the time comes.",
    question: `Level ${level} — Room ${i + 1} question coming soon.`,
    answer: "placeholder",
    hint: "This level has not been configured yet.",
    timerSeconds: 30,
    puzzleType: 'riddle' as const,
  }))

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "THE BASEMENT",
    room: "CHIPSYNC",
    theme: "VLSI Physical Design — Placement, Routing, Timing",
    fragment: "Physical Design Blueprint",
    fragmentDesc: "A complete chip floorplan with routing layers — the foundation of silicon.",
    masterRiddle: "You have walked the full physical design flow. One word describes the final geometric check that clears a chip for fabrication. What is it?",
    masterAnswer: "drc",
    masterHint: "Design Rule Check. Three letters.",
    color: "#8b0000",
    episodes: level1Episodes,
  },
  {
    id: 2,
    title: "THE STUDY",
    room: "COMING SOON",
    theme: "To be configured by admin — Week 2",
    fragment: "Study Fragment",
    fragmentDesc: "Fragment from the Study — content coming soon.",
    masterRiddle: "The Study master riddle has not been set yet.",
    masterAnswer: "placeholder",
    masterHint: "This level has not been configured yet.",
    color: "#1a3a5c",
    episodes: placeholderEpisodes(2, 10),
  },
  {
    id: 3,
    title: "THE LAB",
    room: "COMING SOON",
    theme: "To be configured by admin — Week 3",
    fragment: "Lab Fragment",
    fragmentDesc: "Fragment from the Lab — content coming soon.",
    masterRiddle: "The Lab master riddle has not been set yet.",
    masterAnswer: "placeholder",
    masterHint: "This level has not been configured yet.",
    color: "#1a3a1a",
    episodes: placeholderEpisodes(3, 20),
  },
  {
    id: 4,
    title: "THE ATTIC",
    room: "COMING SOON",
    theme: "To be configured by admin — Week 4",
    fragment: "Attic Fragment",
    fragmentDesc: "Fragment from the Attic — content coming soon.",
    masterRiddle: "The Attic master riddle has not been set yet.",
    masterAnswer: "placeholder",
    masterHint: "This level has not been configured yet.",
    color: "#3a1a5c",
    episodes: placeholderEpisodes(4, 30),
  },
]

export const ALL_EPISODES: Episode[] = LEVELS.flatMap(l => l.episodes)
