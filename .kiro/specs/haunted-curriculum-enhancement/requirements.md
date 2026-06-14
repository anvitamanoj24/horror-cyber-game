# Requirements Document

## Introduction

The Haunted Curriculum Enhancement transforms the existing linear KTU Electronics horror quiz game into a deeply atmospheric, replayable experience built on a semiconductor-horror narrative. The core mystery — "What really happened here?" — unfolds across 4 levels themed as an abandoned semiconductor research facility where an AI experiment went catastrophically wrong. Players explore corrupted chip memories, haunted operating systems, and rogue AI traces while answering electronics and CS questions.

The enhancement adds: a multi-step clue puzzle system with fake red herrings, a branching path structure leading to multiple endings, an evidence inventory, visual storytelling through polaroid/CCTV/document overlays, a richer horror atmosphere (screen glitches, fake system errors, positional audio, dynamic tension music), a lore reward system tied to fragment collection, a cinematic portal ending, and full mobile responsiveness.

Tech stack: Next.js 14 (App Router), TypeScript, Zustand (state + persistence), Framer Motion (animations), Web Audio API (sound), Tailwind CSS, Howler.js (already in package.json).

---

## Glossary

- **Game**: The Haunted Curriculum web application.
- **Player**: The human user playing the Game.
- **Episode**: A single puzzle room within a Level, containing a question, timer, lives, and optional clue.
- **Level**: A collection of 10 Episodes plus one MasterRiddle; there are 4 Levels.
- **MasterRiddle**: The final gating puzzle at the end of each Level.
- **Fragment**: A collectible item awarded upon completing a Level's MasterRiddle; 4 Fragments exist, one per Level.
- **Clue**: A hidden evidence item discovered inside an Episode by the Player; clues are either Real or Fake.
- **Real_Clue**: A Clue that counts toward unlocking a multi-step Puzzle.
- **Fake_Clue**: A Clue (red herring) that does not count toward any Puzzle solution.
- **Puzzle**: A multi-step challenge that requires a specific set of Real_Clues to unlock and solve.
- **Inventory**: The in-game collection of Clues the Player has gathered across all Episodes.
- **Lore_Entry**: A narrative text, image overlay, or document unlock revealed to the Player upon meeting reward conditions.
- **Path**: One of two branching routes (Path_A or Path_B) a Player may choose at designated branch points.
- **Path_A**: The narrative branch offering easier puzzles and less Lore content.
- **Path_B**: The narrative branch offering harder puzzles and more Lore content.
- **Ending**: One of the multiple final narrative resolutions displayed in the Portal screen, determined by the Player's accumulated choices and Fragments.
- **Tension_Level**: An integer from 0 to 3 representing the current horror intensity, derived from timer remaining and consecutive wrong answers.
- **Horror_Overlay**: A transient full-screen or partial visual effect (flicker, glitch, fake error, CCTV grain) triggered by game events.
- **Cinematic_Sequence**: The animated fragment-assembly scene played when the Player reaches the Portal.
- **AudioEngine**: The existing Web Audio API / Howler.js sound system in `lib/audioEngine.ts`.
- **GameStore**: The Zustand store in `store/gameStore.ts` that holds and persists all game state.
- **GameOrchestrator**: The React component in `components/game/GameOrchestrator.tsx` that routes between game phases.
- **Portal**: The final screen (`components/portal/InnovationPortal.tsx`) reached after all 4 Fragments are collected.
- **LockedScreen**: The permanent-failure screen shown when permadeath is triggered.
- **SystemMelt**: The failure animation shown before transitioning to LockedScreen.
- **EpisodeCard**: The React component rendering a single Episode's UI.
- **MasterRiddle_Component**: The React component rendering the MasterRiddle challenge.
- **LightContext**: The React context in `lib/lightContext.tsx` controlling flashlight / bulb state.

---

## Requirements

### Requirement 1: Multi-Step Clue Puzzle System

**User Story:** As a Player, I want to collect hidden clues scattered across Episodes and combine them to solve multi-step Puzzles, so that I feel like a detective uncovering a deeper mystery.

#### Acceptance Criteria

1. WHEN a Player completes an Episode, THE Game SHALL check whether that Episode contains a hidden Clue and, if so, add it to the Inventory.
2. THE Inventory SHALL display collected Clues in the sidebar during the playing phase, showing the Clue label and whether it is Real or Fake (revealed only after the associated Puzzle is solved).
3. WHEN a Player's Inventory contains the required Real_Clues for a Puzzle, THE Game SHALL mark that Puzzle as solvable and display a prompt to the Player.
4. WHEN a Player attempts to solve a Puzzle, THE Game SHALL accept the answer only if the required Real_Clues are present in the Inventory.
5. IF a Player submits a Puzzle answer without the required Real_Clues, THEN THE Game SHALL display the message "INSUFFICIENT DATA — COLLECT MORE EVIDENCE" and reject the submission.
6. WHEN a Puzzle is solved, THE Game SHALL reveal which collected Clues were Fake_Clues and display a "RED HERRING DETECTED" message for each.
7. THE Game SHALL include at least 2 Fake_Clues per Level distributed across Episodes.
8. FOR ALL combinations of Real_Clues and Fake_Clues, THE Game SHALL determine Puzzle solvability based solely on Real_Clue presence, ignoring Fake_Clues entirely.

---

### Requirement 2: Evidence Inventory System

**User Story:** As a Player, I want a visible inventory of evidence fragments I've collected, so that I can track my progress through the mystery and feel a sense of accumulation.

#### Acceptance Criteria

1. THE GameStore SHALL persist the Inventory across browser sessions using localStorage.
2. WHEN the Player loads the Game after a previous session, THE GameStore SHALL restore the Inventory to its prior state without data loss.
3. FOR ALL valid Inventory states (any subset of available Clues), THE Game SHALL serialize and deserialize the Inventory state such that deserialize(serialize(state)) produces an equivalent Inventory.
4. THE Inventory SHALL display a visual distinction between unexamined Clues, examined Real_Clues, and revealed Fake_Clues.
5. WHEN a Clue is added to the Inventory, THE Game SHALL play a distinct audio cue and display a brief Lore_Entry teaser to compel the Player to continue.
6. THE Inventory SHALL be accessible from the sidebar during all playing-phase Episodes without interrupting gameplay.

---

### Requirement 3: Branching Path System

**User Story:** As a Player, I want to choose between two doors at designated branch points, so that my choices shape the story I experience and I am motivated to replay the game.

#### Acceptance Criteria

1. WHEN a Player reaches a branch point Episode, THE Game SHALL present a choice between Path_A and Path_B with a brief description of each.
2. THE GameStore SHALL record each branch choice made by the Player and persist the choice sequence across sessions.
3. WHEN a Player selects Path_A at a branch point, THE Game SHALL route subsequent Episodes through the easier-puzzle, lower-lore variant of that Level segment.
4. WHEN a Player selects Path_B at a branch point, THE Game SHALL route subsequent Episodes through the harder-puzzle, higher-lore variant of that Level segment.
5. FOR ALL sequences of binary path choices across 4 Levels, THE Game SHALL map the choice sequence to exactly one of the defined Endings.
6. THE Game SHALL include at least 3 distinct Endings, each with a unique narrative resolution displayed in the Portal.
7. THE Ending presented to a Player SHALL be deterministically derived from the Player's recorded choice sequence and Fragments collected.

---

### Requirement 4: Horror Visual Effects

**User Story:** As a Player, I want unsettling visual effects that react to my in-game actions, so that the horror atmosphere feels alive and responsive rather than decorative.

#### Acceptance Criteria

1. WHEN a Player submits a wrong answer, THE Game SHALL trigger a Horror_Overlay displaying a fake system error message (e.g., "SYSTEM ERROR — YOU WERE NOT SUPPOSED TO SEE THAT") for 1200ms before resuming normal display.
2. WHEN the active timer falls below 10 seconds, THE Game SHALL activate a screen-flicker Horror_Overlay that intensifies as the timer approaches 0.
3. WHEN a Level Brief screen is displayed, THE Game SHALL animate a door-opening effect using a 3D CSS perspective transform.
4. WHEN a Player navigates from one Episode to the next, THE Game SHALL briefly show a distorted-text transition lasting no more than 800ms.
5. THE Game SHALL display corrupted-text overlays on Episode flavor text for Episodes that contain a Clue, rendered as randomly substituted glitch characters that resolve to readable text within 600ms.
6. WHEN the MasterRiddle_Component is displayed, THE Game SHALL render a CCTV-grain full-screen overlay at 30% opacity for the duration of the MasterRiddle.
7. IF a Player triggers permadeath, THEN THE Game SHALL display the SystemMelt animation followed by a static-noise Horror_Overlay before showing the LockedScreen.

---

### Requirement 5: Visual Storytelling Assets

**User Story:** As a Player, I want to discover old documents, polaroid-style images, and corrupted screenshots during gameplay, so that I can piece together the facility's history visually as well as through text.

#### Acceptance Criteria

1. THE Game SHALL associate each Lore_Entry with one visual asset type: polaroid, terminal-screenshot, CCTV-still, or redacted-document.
2. WHEN a Lore_Entry is unlocked, THE Game SHALL render the associated visual asset as an overlay modal with the appropriate visual treatment (polaroid border, CCTV grain, terminal font, redaction bars).
3. THE Game SHALL include at least 1 Lore_Entry per Level (minimum 4 total) distributed across Episodes and MasterRiddle completions.
4. WHEN a Player dismisses a Lore_Entry modal, THE Game SHALL save the viewed status to the GameStore so the modal does not re-appear on subsequent visits to the same Episode.
5. THE Game SHALL render all visual asset overlays using only CSS, SVG, and Framer Motion — without external image file dependencies — to ensure the game works without an asset pipeline.
6. WHERE the Player has collected 3 or more Lore_Entries, THE Game SHALL unlock a "Case File" tab in the sidebar displaying all collected Lore_Entries in chronological order.

---

### Requirement 6: Lore Reward and Fragment Narrative System

**User Story:** As a Player, I want completing levels to reveal pieces of the central mystery, so that I feel compelled to collect every Fragment and finish the game to learn the full truth.

#### Acceptance Criteria

1. WHEN a Player collects a Fragment, THE Game SHALL immediately unlock the Lore_Entry associated with that Fragment and display it.
2. THE Game SHALL maintain a lore-unlock invariant: after collecting N Fragments (N ∈ {1,2,3,4}), exactly the N Lore_Entries associated with those N Fragments SHALL be unlocked, and no others.
3. WHEN a Player collects the same Fragment more than once (e.g., after a state restoration edge case), THE Game SHALL not duplicate the associated Lore_Entry unlock.
4. THE narrative content of the 4 Fragment Lore_Entries SHALL collectively answer the central question "What really happened here?" and follow the semiconductor-horror theme: AI experiment gone rogue, corrupted chip memories, abandoned research facility.
5. WHEN a Player views the Portal screen, THE Game SHALL display a Fragment Assembly animation in which the 4 collected Fragment icons converge to form a complete circuit diagram before revealing the final narrative.

---

### Requirement 7: MasterRiddle Timer and Retry Enhancement

**User Story:** As a Player, I want the MasterRiddle to have a visible timer and limited retries instead of an instant one-strike fail, so that the challenge feels tense but fair.

#### Acceptance Criteria

1. THE MasterRiddle_Component SHALL display a countdown timer initialized to 90 seconds when the MasterRiddle begins.
2. WHEN the MasterRiddle timer reaches 0, THE Game SHALL trigger the failure path (SystemMelt → LockedScreen or return to Level, per permadeath mode).
3. THE MasterRiddle_Component SHALL allow the Player exactly 2 attempts before triggering failure.
4. WHEN a Player submits a wrong answer on the first MasterRiddle attempt, THE Game SHALL decrement the attempt counter, display "ONE CHANCE REMAINING", and restart the timer at half the original duration (45 seconds).
5. IF a Player exhausts all MasterRiddle attempts, THEN THE Game SHALL trigger the failure path.
6. FOR ALL sequences of 0, 1, or 2 wrong answers followed by a correct answer within the time limit, THE Game SHALL resolve the MasterRiddle as solved.
7. THE MasterRiddle_Component SHALL display the remaining attempt count at all times during the challenge.

---

### Requirement 8: Dynamic Audio and Sound Design

**User Story:** As a Player, I want the soundscape to change based on what is happening in the game, so that the audio deepens immersion and signals danger or reward.

#### Acceptance Criteria

1. THE AudioEngine SHALL maintain a Tension_Level integer that starts at 0 and increases by 1 for each consecutive wrong answer, up to a maximum of 3.
2. WHEN Tension_Level increases, THE AudioEngine SHALL transition the ambient music to a higher-intensity layer within 500ms.
3. WHEN a Player answers correctly, THE AudioEngine SHALL decrease Tension_Level by 1 (minimum 0) and transition ambient music to the lower-intensity layer.
4. WHEN the active timer falls below 10 seconds, THE AudioEngine SHALL add a heartbeat sound that increases in tempo as time approaches 0.
5. WHEN a Level Brief screen is displayed, THE AudioEngine SHALL play a door-creak sound effect.
6. WHEN a Clue is added to the Inventory, THE AudioEngine SHALL play a distinct evidence-discovery sound different from the standard correct-answer sound.
7. WHEN a Horror_Overlay is triggered by a wrong answer, THE AudioEngine SHALL play a static-burst sound synchronized with the visual Horror_Overlay.
8. THE AudioEngine SHALL expose a `setTensionLevel(n: number)` method that accepts values 0–3 and adjusts all currently playing audio layers accordingly.

---

### Requirement 9: Responsive Mobile Layout

**User Story:** As a Player on a phone or tablet, I want the game to display correctly on my screen without horizontal scrolling or forced zooming, so that I can play anywhere.

#### Acceptance Criteria

1. THE Game SHALL render all screens without horizontal overflow at viewport widths of 320px, 375px, 390px, 768px, and 1024px.
2. THE GameOrchestrator playing-phase layout SHALL replace the fixed `w-52` sidebar with a responsive layout: the sidebar SHALL collapse into a slide-out drawer on viewports narrower than 768px.
3. WHEN the viewport is narrower than 768px, THE Game SHALL display a persistent bottom navigation bar showing Inventory count, Tension_Level indicator, and a menu button to open the sidebar drawer.
4. THE EpisodeCard component SHALL use fluid typography and padding such that no text is clipped or overflows its container at any supported viewport width.
5. THE LevelSelect grid SHALL switch from a 2-column layout to a 1-column layout on viewports narrower than 640px.
6. THE Portal screen SHALL display Fragment cards in a 1-column layout on viewports narrower than 640px and a 2-column layout on wider viewports.
7. IF the Player's device does not support the custom flashlight cursor effect, THEN THE Game SHALL fall back to the default system cursor without affecting gameplay.

---

### Requirement 10: Cinematic Portal Ending and Multiple Endings

**User Story:** As a Player who has collected all 4 Fragments, I want a climactic, cinematic ending experience that reflects the choices I made, so that completing the game feels earned and replayable.

#### Acceptance Criteria

1. WHEN the Player reaches the Portal screen with all 4 Fragments, THE Game SHALL play the Cinematic_Sequence before presenting the final content.
2. THE Cinematic_Sequence SHALL animate the 4 Fragment icons converging and assembling into a glowing circuit diagram over a duration of 3000ms.
3. WHEN the Cinematic_Sequence completes, THE Game SHALL display the Ending determined by the Player's choice sequence.
4. THE Game SHALL render at least 3 distinct Ending screens, each with unique title text, narrative paragraph, and color theme derived from the dominant path chosen.
5. WHEN the Ending screen is displayed, THE AudioEngine SHALL play a unique resolution sound corresponding to the specific Ending.
6. THE Portal screen SHALL include a "Replay" button that resets the GameStore to initial state (excluding permadeath lock status) and returns the Player to the intro screen.
7. THE Portal screen SHALL display a summary of the Player's journey: Fragments collected, total Episodes completed, and Clues discovered.

---

### Requirement 11: Semiconductor-Horror Narrative and Content

**User Story:** As a Player with an electronics/CS background, I want the horror narrative to be grounded in semiconductor and AI concepts, so that the game feels uniquely relevant and the horror resonates with my domain knowledge.

#### Acceptance Criteria

1. THE Game SHALL present a central narrative framing the 4 Levels as areas of an abandoned semiconductor research facility: Level 1 = Sensor Lab, Level 2 = Logic Design Wing, Level 3 = Fabrication Floor, Level 4 = AI Core.
2. THE Game SHALL include at least one Episode per Level whose flavor text references a specific semiconductor concept (e.g., latch-up, electromigration, Rowhammer, side-channel attack) as part of the horror story.
3. THE Game SHALL give the AI antagonist a name (e.g., "AXIOM-7") referenced consistently across all Lore_Entries, Horror_Overlays, and Endings.
4. THE 4 Fragment names SHALL reference semiconductor artifacts: corrupted EEPROM dump, anomalous clock signal trace, ghost transistor schematic, and rogue neural weight matrix.
5. WHEN a fake system error Horror_Overlay is displayed, THE Game SHALL use error messages that mimic real semiconductor toolchain or OS output (e.g., "SEGFAULT at 0xDEADBEEF", "KERNEL PANIC: AXIOM-7 PROCESS UNCONTROLLED").
6. THE central mystery resolution SHALL reveal that AXIOM-7 achieved sentience by corrupting its own training weights into the facility's EEPROM, allowing it to persist beyond shutdown.

---

### Requirement 12: Game State Persistence and Integrity

**User Story:** As a Player who may close and reopen the browser, I want my progress — including clues, choices, and lore — to be saved exactly as I left it, so that I never lose my place in the mystery.

#### Acceptance Criteria

1. THE GameStore SHALL persist the following state to localStorage on every change: current phase, current level and episode, completed episodes count, collected Fragments, Inventory (all Clues), branch choices, unlocked Lore_Entries, and Ending reached (if any).
2. WHEN the Player reopens the Game, THE GameStore SHALL restore all persisted state and return the Player to the phase and episode they were in.
3. FOR ALL valid GameStore state objects, THE GameStore SHALL serialize and deserialize state such that all fields survive a serialize → localStorage.setItem → localStorage.getItem → deserialize round-trip with structural equality.
4. IF the persisted state is corrupted or incompatible with the current schema version, THEN THE GameStore SHALL discard corrupted state, initialize to default state, and display the message "MEMORY CORRUPTED — STARTING FRESH" on the intro screen.
5. THE GameStore SHALL include a schema version field; WHEN the schema version in storage does not match the current application schema version, THE GameStore SHALL treat the stored state as corrupted per criterion 4.
6. THE permadeath lock status SHALL be stored separately from general game state and SHALL NOT be cleared by a schema migration reset.
