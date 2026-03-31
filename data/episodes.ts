export interface Episode {
  id: number
  level: number
  episodeInLevel: number
  question: string
  answer: string
  hint: string
  flavor: string // atmospheric flavor text
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

// LEVEL 1 — THE BASEMENT (Analog Shadows)
const level1Episodes: Episode[] = [
  {
    id: 1, level: 1, episodeInLevel: 1,
    flavor: "A rusted fuse box hums in the corner. Something is trapped inside.",
    question: "The transistor's collector is flooded. What single word describes the region where Vce is near zero and the transistor is fully ON?",
    answer: "saturation",
    hint: "It's not cutoff. It's not active. The door is jammed shut.",
    timerSeconds: 20, puzzleType: 'lateral'
  },
  {
    id: 2, level: 1, episodeInLevel: 2,
    flavor: "A flickering bulb blinks in Morse code: — — — · · · — — —",
    question: "The bulb is spelling something. Decode: — — — · · · — — —",
    answer: "sos",
    hint: "Three long, three short, three long. A universal distress signal.",
    timerSeconds: 25, puzzleType: 'morse'
  },
  {
    id: 3, level: 1, episodeInLevel: 3,
    flavor: "A MOSFET lies on the workbench. Its gate is hungry.",
    question: "I control current without touching it. I am voltage-controlled, not current-controlled. I have a Gate, Drain, and Source. What am I?",
    answer: "mosfet",
    hint: "Metal Oxide Semiconductor. The ghost's gatekeeper.",
    timerSeconds: 15, puzzleType: 'riddle'
  },
  {
    id: 4, level: 1, episodeInLevel: 4,
    flavor: "The oscilloscope shows a waveform. The ghost is riding it.",
    question: "A transistor biased in the active region amplifies. If β=100 and Ib=20μA, what is Ic in mA?",
    answer: "2",
    hint: "Ic = β × Ib. Simple multiplication. The ghost is counting.",
    timerSeconds: 20, puzzleType: 'logic'
  },
  {
    id: 5, level: 1, episodeInLevel: 5,
    flavor: "Scratched into the wall: 'The diode only lets me pass one way.'",
    question: "A diode in a circuit has 0.7V across it. The supply is 5V. The resistor is 430Ω. What is the current in mA? (round to nearest whole number)",
    answer: "10",
    hint: "V = IR. Use (5 - 0.7) / 430. The ghost wants the exact number.",
    timerSeconds: 25, puzzleType: 'logic'
  },
  {
    id: 6, level: 1, episodeInLevel: 6,
    flavor: "A dusty IC chip on the shelf. Its label is half-burned: NE5__",
    question: "The burned IC is a timer. Complete the part number: NE5__",
    answer: "555",
    hint: "Three fives. The most famous timer IC ever made.",
    timerSeconds: 15, puzzleType: 'hidden'
  },
  {
    id: 7, level: 1, episodeInLevel: 7,
    flavor: "The ghost whispers: 'I am the region between ON and OFF.'",
    question: "In a BJT, the region where the transistor acts as an amplifier — neither fully ON nor fully OFF — is called the _____ region.",
    answer: "active",
    hint: "Not saturation. Not cutoff. The middle ground.",
    timerSeconds: 15, puzzleType: 'lateral'
  },
  {
    id: 8, level: 1, episodeInLevel: 8,
    flavor: "Morse code taps on the pipe: · — · · · — — · · ·",
    question: "Decode the pipe taps: · — · · · — — · · ·",
    answer: "lvs",
    hint: "L = ·—·· | V = ···— | S = ··· — wait, check again. L·V·S",
    timerSeconds: 30, puzzleType: 'morse'
  },
  {
    id: 9, level: 1, episodeInLevel: 9,
    flavor: "A voltage divider circuit is drawn in blood on the floor.",
    question: "Voltage divider: Vin=12V, R1=6kΩ, R2=4kΩ. What is Vout across R2 in volts?",
    answer: "4.8",
    hint: "Vout = Vin × R2/(R1+R2). The ghost needs exactly this voltage.",
    timerSeconds: 25, puzzleType: 'logic'
  },
  {
    id: 10, level: 1, episodeInLevel: 10,
    flavor: "The basement door has a combination lock. The answer is hidden in the schematic.",
    question: "A common-emitter amplifier inverts the signal. If input is a sine wave at +1V peak, the output phase is shifted by how many degrees?",
    answer: "180",
    hint: "Inversion = phase flip. The ghost walks backwards.",
    timerSeconds: 20, puzzleType: 'lateral'
  },
]

// LEVEL 2 — THE STUDY (Digital Whispers)
const level2Episodes: Episode[] = [
  {
    id: 11, level: 2, episodeInLevel: 1,
    flavor: "Books on the shelf spell out a logic equation in their spines.",
    question: "A gate that outputs 1 only when ALL inputs are 1. Its name is also a conjunction in English. What gate?",
    answer: "and",
    hint: "A AND B. Both must be true. The ghost requires consensus.",
    timerSeconds: 15, puzzleType: 'riddle'
  },
  {
    id: 12, level: 2, episodeInLevel: 2,
    flavor: "The typewriter types by itself: 0 XOR 0 = ?",
    question: "The typewriter demands: 1 XOR 1 = ?",
    answer: "0",
    hint: "XOR is true only when inputs DIFFER. Same inputs = 0.",
    timerSeconds: 10, puzzleType: 'logic'
  },
  {
    id: 13, level: 2, episodeInLevel: 3,
    flavor: "A Verilog snippet is carved into the desk. One keyword is missing.",
    question: "In Verilog, to describe combinational logic that reacts to any input change, you use: always @(_____)",
    answer: "*",
    hint: "The wildcard. Sensitive to everything. The ghost watches all.",
    timerSeconds: 20, puzzleType: 'hidden'
  },
  {
    id: 14, level: 2, episodeInLevel: 4,
    flavor: "A truth table is pinned to the wall with a rusty nail.",
    question: "NAND gate: inputs A=1, B=1. Output = ?",
    answer: "0",
    hint: "NAND = NOT AND. AND(1,1)=1, then NOT = 0.",
    timerSeconds: 10, puzzleType: 'logic'
  },
  {
    id: 15, level: 2, episodeInLevel: 5,
    flavor: "The ghost is a flip-flop, stuck in an unknown state.",
    question: "A D flip-flop stores 1 bit. On the rising clock edge, Q follows D. If D=0 and clock rises, Q becomes?",
    answer: "0",
    hint: "D flip-flop: Q = D on clock edge. Simple as a ghost's memory.",
    timerSeconds: 15, puzzleType: 'logic'
  },
  {
    id: 16, level: 2, episodeInLevel: 6,
    flavor: "Morse code scratched under the desk: — · · · · · · · ·",
    question: "Decode: — · · · · · · · · (one dash, eight dots)",
    answer: "t8",
    hint: "T = — and 8 = —···· wait... T=— then count the dots for a digit.",
    timerSeconds: 30, puzzleType: 'morse'
  },
  {
    id: 17, level: 2, episodeInLevel: 7,
    flavor: "A register file diagram is drawn in the dust.",
    question: "How many bits does a nibble contain?",
    answer: "4",
    hint: "Half a byte. The ghost only ate half.",
    timerSeconds: 10, puzzleType: 'riddle'
  },
  {
    id: 18, level: 2, episodeInLevel: 8,
    flavor: "The ghost is a state machine, looping forever.",
    question: "In a Moore machine, the output depends on the _____ only, not the input.",
    answer: "state",
    hint: "Moore = output from state. Mealy = output from state + input.",
    timerSeconds: 20, puzzleType: 'lateral'
  },
  {
    id: 19, level: 2, episodeInLevel: 9,
    flavor: "A binary number is written in blood: 1010",
    question: "Convert binary 1010 to decimal.",
    answer: "10",
    hint: "8+0+2+0 = ? The ghost counts in powers of 2.",
    timerSeconds: 15, puzzleType: 'logic'
  },
  {
    id: 20, level: 2, episodeInLevel: 10,
    flavor: "The study door lock requires the universal logic gate.",
    question: "Which single gate type can implement ANY Boolean function by itself? (two possible answers — pick the simpler one)",
    answer: "nand",
    hint: "NAND or NOR — both are universal. NAND is more common in CMOS.",
    timerSeconds: 20, puzzleType: 'lateral'
  },
]

// LEVEL 3 — THE LAB (The Fabrication)
const level3Episodes: Episode[] = [
  {
    id: 21, level: 3, episodeInLevel: 1,
    flavor: "Silicon wafers line the shelves like pale dinner plates.",
    question: "The process of adding controlled impurities to silicon to change its conductivity is called?",
    answer: "doping",
    hint: "N-type gets electrons. P-type gets holes. The ghost is impure.",
    timerSeconds: 15, puzzleType: 'riddle'
  },
  {
    id: 22, level: 3, episodeInLevel: 2,
    flavor: "A photomask hangs on the wall like a stained glass window.",
    question: "The lithography process uses _____ to transfer circuit patterns onto silicon.",
    answer: "light",
    hint: "Photo = light. The ghost is afraid of it.",
    timerSeconds: 15, puzzleType: 'lateral'
  },
  {
    id: 23, level: 3, episodeInLevel: 3,
    flavor: "Morse code blinks from the UV lamp: · · · — — — · · ·",
    question: "Decode the UV lamp: · · · — — — · · ·",
    answer: "sos",
    hint: "Three dots, three dashes, three dots. The silicon is in distress.",
    timerSeconds: 20, puzzleType: 'morse'
  },
  {
    id: 24, level: 3, episodeInLevel: 4,
    flavor: "A MOSFET cross-section diagram is etched into the lab bench.",
    question: "In a MOSFET, the thin insulating layer between the gate and channel is made of?",
    answer: "sio2",
    hint: "Silicon dioxide. Glass. The ghost's invisible wall.",
    timerSeconds: 20, puzzleType: 'hidden'
  },
  {
    id: 25, level: 3, episodeInLevel: 5,
    flavor: "Gordon Moore's portrait hangs crooked on the wall.",
    question: "Moore's Law states transistor count doubles approximately every ___ years.",
    answer: "2",
    hint: "Two years. The ghost doubles in power every two years.",
    timerSeconds: 15, puzzleType: 'riddle'
  },
  {
    id: 26, level: 3, episodeInLevel: 6,
    flavor: "A layout diagram shows a CMOS inverter. Something is missing.",
    question: "A CMOS inverter uses one PMOS and one NMOS transistor. When input is HIGH, which transistor is ON?",
    answer: "nmos",
    hint: "NMOS turns ON with high gate voltage. PMOS turns ON with low.",
    timerSeconds: 20, puzzleType: 'logic'
  },
  {
    id: 27, level: 3, episodeInLevel: 7,
    flavor: "The ghost is trapped in the depletion region.",
    question: "The region at a P-N junction depleted of free carriers is called the _____ region.",
    answer: "depletion",
    hint: "Depleted. Empty. Where the ghost lives.",
    timerSeconds: 15, puzzleType: 'lateral'
  },
  {
    id: 28, level: 3, episodeInLevel: 8,
    flavor: "A 300mm wafer sits under glass. How many chips can it hold?",
    question: "In VLSI, 'yield' refers to the percentage of _____ chips on a wafer.",
    answer: "functional",
    hint: "Not all chips work. Yield = working / total. The ghost culls the weak.",
    timerSeconds: 20, puzzleType: 'lateral'
  },
  {
    id: 29, level: 3, episodeInLevel: 9,
    flavor: "The lab notebook shows a mystery equation: P = C × V² × f",
    question: "In CMOS, P = C·V²·f represents dynamic power. To halve power consumption, you could halve V. By what factor does power reduce?",
    answer: "4",
    hint: "V is squared. Halve V → V²/4. Power reduces by factor of 4.",
    timerSeconds: 25, puzzleType: 'logic'
  },
  {
    id: 30, level: 3, episodeInLevel: 10,
    flavor: "The lab door has a 7-segment display showing a scrambled number.",
    question: "What does IC stand for in the context of chip manufacturing?",
    answer: "integrated circuit",
    hint: "Many components. One chip. The ghost is integrated.",
    timerSeconds: 15, puzzleType: 'riddle'
  },
]

// LEVEL 4 — THE ATTIC (Future Ghost)
const level4Episodes: Episode[] = [
  {
    id: 31, level: 4, episodeInLevel: 1,
    flavor: "Cobwebs form the shape of a neural network in the corner.",
    question: "A computing paradigm that mimics the human brain's neural architecture, using artificial neurons and synapses on silicon, is called _____ computing.",
    answer: "neuromorphic",
    hint: "Neuro = brain. Morphic = shaped like. The ghost thinks like you.",
    timerSeconds: 30, puzzleType: 'riddle'
  },
  {
    id: 32, level: 4, episodeInLevel: 2,
    flavor: "A tiny sensor is nailed to the wall. It's listening.",
    question: "The hint from the Basement was an acoustic sensor. What type of ML model is best suited for classifying audio scenes in real-time on edge devices?",
    answer: "cnn",
    hint: "Convolutional Neural Network. Slides a filter over data like a ghost through walls.",
    timerSeconds: 30, puzzleType: 'lateral'
  },
  {
    id: 33, level: 4, episodeInLevel: 3,
    flavor: "Morse code from the attic radio: · — · — · —",
    question: "Decode the attic radio: · — · — · —",
    answer: "ababab",
    hint: "· = E, — = T... or think of it as alternating: dot-dash repeated 3 times.",
    timerSeconds: 30, puzzleType: 'morse'
  },
  {
    id: 34, level: 4, episodeInLevel: 4,
    flavor: "A wearable device blueprint is pinned to the rafters.",
    question: "Processing data at the source rather than sending it to the cloud is called _____ computing.",
    answer: "edge",
    hint: "The opposite of cloud. Local. The ghost doesn't trust the internet.",
    timerSeconds: 20, puzzleType: 'lateral'
  },
  {
    id: 35, level: 4, episodeInLevel: 5,
    flavor: "A quantum computer blueprint is drawn in chalk on the attic floor.",
    question: "The basic unit of quantum information, which can exist in superposition of 0 and 1 simultaneously, is called a?",
    answer: "qubit",
    hint: "Quantum bit. The ghost is both here and not here.",
    timerSeconds: 25, puzzleType: 'riddle'
  },
  {
    id: 36, level: 4, episodeInLevel: 6,
    flavor: "An IoT sensor network diagram covers the entire ceiling.",
    question: "The lightweight publish-subscribe messaging protocol used by most IoT devices is called?",
    answer: "mqtt",
    hint: "Message Queuing Telemetry Transport. The ghost's preferred communication.",
    timerSeconds: 25, puzzleType: 'hidden'
  },
  {
    id: 37, level: 4, episodeInLevel: 7,
    flavor: "A chip blueprint shows reconfigurable logic blocks.",
    question: "A chip whose logic can be reprogrammed after manufacturing using hardware description language is called an?",
    answer: "fpga",
    hint: "Field Programmable Gate Array. The ghost can change its mind.",
    timerSeconds: 25, puzzleType: 'riddle'
  },
  {
    id: 38, level: 4, episodeInLevel: 8,
    flavor: "The ghost whispers about harvesting energy from the environment.",
    question: "Powering IoT devices by harvesting ambient energy (solar, vibration, RF) instead of batteries is called energy?",
    answer: "harvesting",
    hint: "The ghost feeds on ambient energy. No batteries needed.",
    timerSeconds: 25, puzzleType: 'lateral'
  },
  {
    id: 39, level: 4, episodeInLevel: 9,
    flavor: "A GAN architecture diagram is scratched into the attic wall.",
    question: "In a Generative Adversarial Network, two networks compete. The one that creates fake data is called the?",
    answer: "generator",
    hint: "Generator vs Discriminator. The ghost generates illusions.",
    timerSeconds: 30, puzzleType: 'lateral'
  },
  {
    id: 40, level: 4, episodeInLevel: 10,
    flavor: "The attic door is the last lock. The ghost is almost free.",
    question: "A chip designed specifically to accelerate neural network inference at ultra-low power for wearable devices is called a Neural Processing ___.",
    answer: "unit",
    hint: "NPU. Neural Processing Unit. The ghost's final form.",
    timerSeconds: 30, puzzleType: 'riddle'
  },
]

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "THE BASEMENT",
    room: "Analog Shadows",
    theme: "Transistors, MOSFETs, Biasing — KTU Week 1",
    fragment: "Acoustic Scene Sensor",
    fragmentDesc: "A MEMS microphone array capable of classifying environmental sounds at 3.3V.",
    masterRiddle: "You've survived the basement. The fuse box hums your reward. What is the name of the region where a BJT transistor is fully ON, collector flooded, door jammed shut?",
    masterAnswer: "saturation",
    masterHint: "The ghost was trapped here at the start.",
    color: "#8b0000",
    episodes: level1Episodes,
  },
  {
    id: 2,
    title: "THE STUDY",
    room: "Digital Whispers",
    theme: "Logic Gates, RTL Design, Verilog — KTU Week 2",
    fragment: "Ultra-Low Power Logic Core",
    fragmentDesc: "A sub-threshold CMOS logic block operating at 0.3V for neurodivergent wearables.",
    masterRiddle: "The study's books hold the answer. Which single gate can build any logic circuit — the universal gate of digital design?",
    masterAnswer: "nand",
    masterHint: "NAND or NOR. The ghost prefers NAND.",
    color: "#1a3a5c",
    episodes: level2Episodes,
  },
  {
    id: 3,
    title: "THE LAB",
    room: "The Fabrication",
    theme: "VLSI, Physical Design, Lithography — KTU Week 3",
    fragment: "Silicon Substrate Blueprint",
    fragmentDesc: "A 7nm process node wafer cross-section optimized for neuromorphic cores.",
    masterRiddle: "The lab holds the secret of creation. What process adds impurities to silicon to make it conduct — the ghost's original sin?",
    masterAnswer: "doping",
    masterHint: "N-type and P-type. The ghost was doped from birth.",
    color: "#1a3a1a",
    episodes: level3Episodes,
  },
  {
    id: 4,
    title: "THE ATTIC",
    room: "Future Ghost",
    theme: "Edge AI, Neuromorphic Computing, IoT — KTU Week 4",
    fragment: "Neuromorphic Wearable Platform",
    fragmentDesc: "An SSCS-based wearable chip integrating NPU + energy harvesting for healthcare AI.",
    masterRiddle: "You stand at the top of the house. Four fragments in hand. What single word describes computing that mimics the human brain's neural architecture on silicon?",
    masterAnswer: "neuromorphic",
    masterHint: "The ghost was always neuromorphic.",
    color: "#3a1a5c",
    episodes: level4Episodes,
  },
]

export const ALL_EPISODES: Episode[] = LEVELS.flatMap(l => l.episodes)
