# Chess Training: The AliouneBT Protocol
*Based on AliouneBT Protocol Documents 1, 2, and 3 — 4,241 games · Chess.com · Target: 2500+*

---

## The Shu-Ha-Ri Framework

From Japanese martial arts philosophy — three stages of mastery that apply to chess:

- **Shu (守) — Follow**: Documents 1 and 2 are entirely Shu. Follow every rule, every algorithm, every framework without deviation. You cannot break rules you have not yet mastered.
- **Ha (破) — Break**: At FM/IM level, you begin to recognize when a rule should be broken and why. Capablanca simplified when theory said attack. Fischer played inferior openings for practical discomfort. Breaking rules intelligently requires knowing them absolutely.
- **Ri (離) — Transcend**: At GM level, the rules no longer feel like rules. They are internalized as part of perception. You do not apply the CCT checklist — you see the board through a CCT lens automatically. The algorithm has become intuition.

### The Dreyfus Skill Acquisition Model — Applied to Chess

| Level | ELO Range | How Rules Are Used | What Determines the Move |
|---|---|---|---|
| Novice | 600–1200 | Applied rigidly and consciously | The first rule that applies |
| Advanced Beginner | 1200–1600 | Recognizes situational exceptions | Rules + some pattern recognition |
| Competent | 1600–2000 | Uses plans and goals consciously | Plans built from internalized rules |
| Proficient | 2000–2300 | Sees situations holistically | Pattern recognition supplements rules |
| Expert | 2300–2500 | Intuitive grasp of most situations | Mostly intuitive, rules verify |
| Master/GM | 2500+ | Rules run non-consciously | Pure intuitive perception + deep calculation |

---

## Section 0 — The Five Golden Rules (Firmware)

These are always-on constants. No move is executed without passing every filter below. The King is the ultimate beneficiary of this system.

**Rule 1 — Connectivity**
Every piece must be defended by at least one other piece. An undefended piece is a broken circuit. Build a web of mutual support where every piece is a node connected to at least one other. Think IF/THEN: if I move this piece, which of my other pieces loses its defender? Applied offensively: Alekhine's Gun. Applied from move 1: Capablanca's 3 Pillars.

**Rule 2 — Simplification**
When you hold a material lead (even +1 pawn) or a structural advantage, force trades. Reduce complexity until the win is mathematically certain.
- Exception 1: never simplify into a drawn endgame (wrong-colored Bishop vs. King).
- Exception 2: when your advantage is SPACE (not material), refuse exchanges — every trade relieves the opponent's congestion and undoes your positional work.
- Egoism error (Rowson): refusing to simplify into a drawn endgame because you believe you should be winning. If the position is objectively drawn, ego does not change the evaluation.

**Rule 3 — CCT Pre-Flight Check**
You are forbidden from moving until you have answered: what are my opponent's immediate Checks, Captures, and Threats after my intended move? Run this for both sides. This eliminates Hope Chess — moving a piece and hoping the opponent does not see the mistake. CCT replaces hope with verification. Think of it as a Unit Test: if the test fails, the move goes back to the candidate list. Sacrifices are only valid when CCT confirms they are clean.

**Rule 4 — Prophylaxis**
Before evaluating your own attack, ask: what is my opponent's single best move right now? Stop it before they play it. This is the difference between reactive (club) and proactive (master) chess.

**Rule 5 — Worst Piece Upgrade**
When no tactical firefight is occurring, identify the piece with the fewest legal squares or blocked by your own pawns. Spend 1–2 moves repositioning it. Four active players always beat three active plus one sitting doing nothing. The spectator piece is a wasted resource. The Bad Bishop IS always the Worst Piece by definition.

---

## Section 0A — Rules 6 and 7 (Advanced Firmware — Document 2)

Added at the Expert/FM level. Operate above Rules 1–5 as meta-rules for complex positions.

**Rule 6 — Initiative Management**
Initiative is the right to force. Each move under initiative compels the opponent to react. Initiative is temporary — it expires the moment you stop forcing.
- When you hold initiative: keep pressing with forcing moves until the position is concretely won. Do not release initiative for a modest material gain unless the resulting position is clearly winning by the 4 Criteria.
- When you lose initiative: consolidate immediately. Return to Rules 1–5. Do not chase phantom attacks.

**Rule 7 — Practical Decision Making**
The objectively best move is not always the best human move. The Practical Move creates the most difficult problems for your specific opponent to solve at the board under time pressure, even if an engine rates another move higher.
- Criteria: it creates threats the opponent must address immediately; the resulting positions are unfamiliar and hard to navigate; it avoids positions where the opponent has deep preparation.
- Apply especially in time pressure, must-win situations, and positions where your calculation depth exceeds the opponent's.

---

## Section I — The Scanning Library

Run this scan at the start of every turn. Think of it as a sensor array with two modes: **Interrupt** (tactical) and **Poll** (positional). Tactical signals fire like an Interrupt — they stop everything. Positional signals run as a background Poll — checked only when no Interrupt is active.

**Critical rule**: the tactical theme is always the OUTPUT of the scan, never the input. If you walk up to the board already looking for a Greek Gift, you are falling into Confirmation Bias. Scan the raw data first. Let the theme emerge.

### 1A — Tactical Elements (Search for Targets)

**LPDO — Loose Pieces Drop Off**
Scan for any piece with zero defenders (violating Rule 1). These are immediate targets to attack or exploit.

**Ray Scanning — Linear Geometry**
Mentally extend the rays (diagonals, ranks, files) of every Bishop, Rook, and Queen on the board.
- Intersection Points: where two rays from your pieces meet on the same square — fork or double-attack potential.
- X-Ray / Discovery: scan through your own pieces. If a Rook sits behind a Knight on an open file, that file is charged with a discovered attack potential.

**Orbit Scanning — Knight Geometry**
Knights have orbits, not rays. Two filters:
- Color Rule: a Knight can only fork pieces that share the same square color as its landing square. If the enemy King is on a light square and Queen on a dark square, a one-move fork is geometrically impossible.
- L-Map: scan for high-value targets separated by one L-jump. Visualize all 8 landing squares at once.

**Functional Dependencies — Hidden Links**
- Battery (Power Coupler): two or more pieces aligned on the same ray (Queen + Bishop, Rook + Rook). Multiplies pressure — a single defender facing a Battery is already overloaded.
- Frozen Piece (Software Lock): a piece that cannot move because doing so exposes the King or a more valuable piece. Attack another square it was supposed to guard and the defense collapses.
- Overworked Piece (CPU Overload): a piece defending two different squares simultaneously. Attack one target to force it to abandon the other.
- Defender of the Defender: Piece A defends Piece B. Attack Piece A and Piece B becomes LPDO instantly.

**King Exposure**
- Back-rank: is the King trapped behind its own unbroken pawn row with no escape square?
- Pawn Shield: are the f, g, h pawns (or a, b, c for queenside castle) intact? Each missing pawn is a potential infiltration corridor.
- Flight Square (Luft): does the King have an escape square (h3 played proactively)?

### 1B — Positional Elements (Architecture Map)

**1. Pawn Structure**
- Pawn Point: the direction the pawn chain points tells you where to attack. French chain (e6-d5) points queenside. Ruy Lopez chain (e4-d4) points center.
- Pawn Chain: attack the base, not the head. This is how Black attacks White's e5 chain in the French with ...c5.
- Passed Pawn: a pawn with no opposing pawns blocking it or on adjacent files. In the endgame, a passed pawn is often worth more than a piece. Passed pawns must be pushed.
- Isolated Pawn (Isolani): a pawn with no friendly pawns on adjacent files — permanent weakness requiring a piece to defend it. To exploit: blockade with a Knight on the square directly in front, attack with Rooks on the open files. Note: also gives the owner open files and piece activity — dynamic, not always losing.
- Backward Pawn: cannot safely advance or be defended by neighboring pawns. The square in front becomes a permanent outpost for the opponent.
- Doubled Pawns: two pawns of the same color on the same file. Block each other, lack mobility, create open files for the opponent. To exploit: control the open file, attack the front pawn.
- Hanging Pawns: two connected pawns on adjacent open files, separated from the rest of the structure (typically c and d pawns). Dynamic — control space and create piece activity. If attacked and forced to advance or exchange, they become weak. Treat them as temporary energy: use their activity before they become liabilities.
- Pawn Majority: which flank has more pawns? That is your leverage for a passed pawn in the endgame.
- Lever: a pawn that can challenge an enemy pawn by diagonal attack, opening a file or changing the structure. The concrete mechanism behind a pawn break. Before playing a pawn break, identify your lever pawn and the enemy pawn it challenges. If no lever exists, the break cannot be forced.
- Duo: two connected pawns on the same rank (e4-d4 or c5-d5). Stronger than a pawn chain — both advance together. Distinguish from a pawn chain (diagonal, has an attackable base).
- Crippled Majority: a pawn majority that cannot create a passed pawn because its pawns are doubled or on wrong files. Verify whether your majority is healthy before counting it as an advantage.

**2. Piece Status**
- Worst Piece: (Rule 5) the piece with fewest squares or activity. Always your primary positional target to fix.
- Bishop Pair: owning both Bishops in an open or semi-open position. Together they cover both color complexes simultaneously. To exploit: open the position with pawn breaks. To neutralize: close the position.
- Good vs Bad Bishop: is your Bishop on the same color as your own pawns? If yes, it is Bad — your own pawns block its diagonals. Capablanca's rule: place pawns on the OPPOSITE color of your Bishop. If your Bishop is bad, trade it for the opponent's good Bishop.
- Outposts: a square that cannot be attacked by an enemy pawn. Park a Knight there (d5, e5, c6) and it becomes worth as much as a Rook.

**3. Lines — Highways**
- Open Files: columns with no pawns. Whoever places a Rook here first owns the highway.
- Semi-Open File: a column containing only enemy pawns — no friendly pawns. Use Rooks here to pressure the opponent's pawn directly.
- Open Diagonals: same logic for Bishops. An open diagonal to the enemy King is a latent attacking weapon.
- Space Advantage: controlling more than 4 ranks. The opponent's pieces become cramped and interfere with each other. When you have the space advantage, REFUSE exchanges — every trade relieves their congestion.

**4. Square Complexes**
- Color Weakness: if your light-squared Bishop is traded off and your pawns are on dark squares, every light square is a potential enemy outpost. Identify which color complex is weak and whether the opponent has pieces to exploit it.
- Key Squares: squares that, if occupied, structurally collapse the opponent's position.

**5. King Safety**
- Proximity of Defenders: how many friendly pieces can reach the King in one move?
- Pawn Shield: 3 intact pawns in front of the castled King is the standard.
- Flight Square: proactively create a Luft (h3, a3) to prevent back-rank and smothered mate patterns.

**6. Development and Tempo**
- Development Lead: are your Rooks connected? A lead in development is a time-limited tactical weapon.
- Tempo Loss: moving the same piece twice in the opening without a concrete reason gives the opponent free development moves.

**7. Tension — Stored Energy**
- The Snap Rule: tension (pieces staring at each other without capturing) should only be released when it wins material, forces a favorable trade under Rule 2, or improves your pawn structure. Otherwise maintain tension — it keeps the opponent's calculation load high.
- Compensation: a piece sacrifice is valid if it dramatically increases King Safety, Piece Activity, or opens decisive lines. Always evaluate using the 4 Criteria before assuming material = advantage.

### 1C — Prophylactic Scanning — 3–4 Moves Ahead (Document 2)

- Identify the opponent's ideal position: what does it look like in 4 moves if they get everything they want? Which piece do they want to activate? Which square do they want to occupy? Prevent it before they get there.
- Scan for Pawn Break potential: which pawn break is the opponent preparing? Identify the preparation moves they need (Re8, Qd7, Nd7) and recognize the pattern before the break arrives.
- Prophylactic piece placement: place pieces on squares that simultaneously improve your position AND block the opponent's plan. A Knight on d4 develops your position while preventing the opponent's ...c5 break.

### 1D — Advanced Positional Scanning (Document 2)

**Silman's 7 Imbalances — Scan Triggers**
Before every positional decision, identify which imbalances exist:
1. Pawn structure — who has the better structure?
2. Space — who controls more territory?
3. Files and diagonals — who owns the open lines?
4. Development lead — who has more active pieces?
5. Bishop pair — who has both Bishops?
6. Knights vs Bishops — which is better in this specific position?
7. Weak squares — who has more undefendable squares?

Your plan is to increase your favorable imbalances and reduce the opponent's.

**Knights vs Bishops — Concrete Assessment**
- Knights are better in closed positions with fixed pawn chains.
- Bishops are better in open positions with long diagonals.
- In mixed endings: if the pawn structure is fixed and blocked, trade Bishops for Knights. If the position is about to open, keep Bishops.

**Fortress Detection**
Before pushing for a win in an endgame, scan for Fortress potential. Signals: their King is in a corner behind a pawn barrier with no entry points; they have the wrong-colored Bishop for their remaining pawns; all your passed pawns are on the same color as their Bishop.

**Restraint — Deeper than Prophylaxis (Petrosian)**
Rule 4 (Prophylaxis) stops the opponent's specific next move. Restraint goes further — it systematically closes all preparation routes for the opponent's entire strategic plan, 5–10 moves before it materializes. Not "he wants to play Nf5, I play h3" but "his whole strategy depends on ...c5, I place pawns and pieces so that ...c5 can never be prepared." How Petrosian made opponents feel they had no moves without ever facing a specific threat. Apply during the Maneuvering step when no immediate tactics exist.

---

## Section II — Position Classification

Classify the position before generating candidate moves. This determines your thinking mode.

### The 4 Evaluation Criteria (in order of priority)

A higher criterion always overrides a lower one.

1. **King Safety (Highest Priority)**: a naked King with no pawn cover overrides every other advantage. You can be 10 pawns up and still lose instantly. King safety trumps material, activity, and structure.
2. **Piece Activity**: a piece's activity can be worth more than its theoretical value. An active Knight on an outpost can outperform a passive Rook. A material sacrifice is justified if it dramatically increases piece activity.
3. **Material**: generally, a material advantage is good. Count the imbalances: who has more pawns, more pieces, stronger pieces? Material matters most when King Safety and Piece Activity are roughly equal.
4. **Positional Imbalances (Lowest Priority)**: pawn structure, space advantage, color complexes, outposts, open files. These create long-term advantages that accumulate over time but rarely decide the game instantly.

The deeper link: positional play is the gunpowder, tactics are the match. Positional superiority creates tactical opportunities; tactics convert positional advantages into wins.

### The Three Game Phases as Mindsets

| Phase | Primary Goal | Mental Mode |
|---|---|---|
| Opening (moves 1–12) | Capablanca's 3 Pillars + Tempo Rule | Deployment — no deep calculation. Every move asks: am I developing, controlling center, securing King? |
| Middlegame (moves 13–35) | Execute the full Algorithm | Combat — full scan + classification + CCT + candidates. Most games are decided here. |
| Endgame (moves 35+) | Apply mathematical endgame truths | Technique — calculation becomes simpler but precision is absolute. One tempo mistake loses. |

### Position Types

| Type | Condition | Primary Tool | Golden Rule Focus |
|---|---|---|---|
| A — Firefight | Tactical signals found in scan (LPDO, checks, Battery active) | Strict CCT calculation | Rule 3 + Rule 1 |
| B — Maneuver | No forcing moves. Position is structurally imbalanced. | Prophylaxis + Worst Piece | Rule 4 + Rule 5 |
| C — Dynamic Race | Both sides attacking on opposite flanks simultaneously. | Stopwatch (tempo) | Initiative > material |

**Type C detail**: in a dynamic race, structure is irrelevant. The question is: does my attack arrive one move before theirs? Initiative is worth more than a pawn. Do not apply Rule 2 (Simplification) in a race — it cedes the initiative.

### Static vs Dynamic Equality

A position can be equal in two fundamentally different ways:
- **Static equality**: both sides have the same material, same pawn structure, same piece activity — nothing is happening. You can maneuver safely.
- **Dynamic equality**: the position is nominally equal but both sides have active plans and the tension is unresolved — any mistake is immediately punished. Every move is critical.

Misidentifying which type of equality you are in leads to catastrophic blunders: you play a slow positional move in a position that required immediate tactical action.

---

## Section III — The Smirnov Execution Algorithm

Executed for every move. Prevents tunnel vision — the most common cause of blunders at all levels below Master.

**Step 1 — Diagnostic (Scan)**
Run the full Section I scan: Ray/Orbit scanning, LPDO check, Battery detection, Worst Piece identification. Takes 5–10 seconds. Produces raw data for everything that follows.

**Step 2 — Firewall (Prophylaxis — Rule 4)**
Before looking at your own ideas: what is the opponent's single best move right now? What did their last move threaten, open, or enable? If there is an immediate threat, your candidate moves must address it first.

**Step 3 — Classify (Section II)**
Is this a Firefight (Type A), Maneuver (Type B), or Race (Type C)? This determines which candidates you generate next.

**Step 4 — Generate Candidates**
Never touch a piece without first identifying 2–4 candidate moves. The first move your eye lands on is not a candidate — it is a reflex.
- Type A: forcing moves — checks, captures, threats.
- Type B: improving the worst piece, occupying an outpost, trading the bad bishop.
- Type C: moves that maintain or increase initiative, even at material cost.

**Step 5 — The Force Filter: Sequential CCT**
For each candidate, ask: And then what? Work through in strict order:

1. **CHECKS** (exhaust completely first): calculate every check available — even the crazy sacrificial ones. Do not move to Step 2 until you have verified that no check leads to a concrete gain.
2. **CAPTURES and THREATS** (only when checks yield nothing): every capture including desperadoes and Zwischenzug. Direct threats on higher-value pieces, mate threats, pawn breaks.
3. **MANEUVERING** (only when no forcing moves exist): (1) identify the opponent's weaknesses; (2) determine which of your pieces can exploit those weaknesses; (3) identify which of YOUR pieces can be improved to reach that target. Improve it.

**CRITICAL — The Recursive Loop**: after each forcing sequence resolves into a quiet position, restart the entire 3-step process from scratch in the new position. The loop ends only when the resulting position is clearly better, clearly worse, or completely quiet.

**CRITICAL — Don't move until 100% certain**. Most blunders come from rushing. If you are not 100% certain of the consequences, do not play it.

**Anti-Kotov error**: never go back and recalculate a branch you have already analyzed. Once a line is evaluated, move to the next candidate fresh. Returning to a previous branch wastes clock time and produces no new information.

**Step 6 — Desperation Check**
Before committing: if I were my opponent and about to lose, what is the sneakiest, most annoying move available — a stalemate trap, perpetual check, or cheapo? If your move survives this test, it is clean.

Also check the **Wanting error** (Rowson): are you playing a move because it fits the position you wish was on the board rather than the one that IS? If your chosen move only makes sense if the opponent plays passively or makes a specific error, it fails this check.

**Step 7 — Execute**
Play the move that satisfies Rule 1 (Connectivity) and leaves your pieces most active. Never play a move in under 5 seconds unless forced by time pressure. In critical transition positions (moves 10–20), spend a minimum of 2 minutes.

---

## Section IV — The Pattern Library

Grandmaster speed comes from pattern recognition, not faster calculation. Build this library through thematic study, not random puzzles.

### Tactical Themes

**Back-Rank Mate**: King trapped behind intact pawns with no escape.

**Greek Gift (Bxh7+)**: Bishop sacrifice on h7 to shatter the castled King's pawn shield, typically followed by Ng5+ and Qh5.

**Smothered Mate**: Knight delivers mate to a King boxed in by its own pieces.

**Zwischenzug**: an in-between move played before the expected recapture. Changes the board state and breaks the opponent's calculation. The most master-level tactic.

**Fork**: a single piece attacks two or more enemy pieces simultaneously. Every piece can fork — not just Knights. Always scan for fork squares when an enemy King and another high-value piece share the same color.

**Double Check**: the most forcing move in chess. Two pieces deliver check simultaneously — the King cannot block both and must move. Always calculate double checks first in any tactical sequence.

**Removing the Defender**: capture the piece defending a key square or another piece. After removal, the previously defended piece becomes LPDO.

**Clearance Sacrifice**: sacrifice a piece to vacate a square or open a line for a more powerful piece behind it.

**Trapped Piece**: a piece with no safe escape squares. Apply progressive restriction — attack it, cut off escape routes one by one, then capture.

**Deflection / Decoying**: forcing a key defender off its post (deflection) or onto a square where it becomes vulnerable (decoy).

**Windmill**: alternating discovered checks and recaptures that gain material each cycle.

**Skewer**: attack a high-value piece — it moves, and a lower-value piece behind it is captured.

**Pin**: a piece cannot move because doing so exposes a more valuable piece or the King. Tactically wins material. A pinned piece controls zero space and fails to defend its neighbors — it is a Software Lock.

**The Interference**: place a piece on a square that simultaneously interferes with two enemy pieces — breaking the connection between a defender and the piece it defends.

**The Desperado**: when a piece is going to be captured regardless, use it to capture the most valuable enemy piece available before it dies.

**Zugzwang in the Middlegame**: rare but decisive. A middlegame Zugzwang means the opponent has no useful move. Create it by restricting all enemy pieces simultaneously.

**The Mating Net**: a slow but inevitable tightening of mating threats over multiple moves.

### Strategic Themes

**Pawn Break**: a strategic pawn advance that opens a file, changes the pawn structure, or gains space. Always identify your pawn break early — it is your long-term strategic plan made concrete.

**Rook on the 7th Rank**: a Rook placed on the 7th rank simultaneously cuts off the enemy King and attacks pawns. Two Rooks on the 7th rank is often immediately decisive.

**Minority Attack**: use 2 pawns to attack 3 enemy pawns, creating a permanent isolated or backward pawn weakness.

**The Blockade**: park a Knight (or Bishop) directly in front of a passed pawn to freeze its advance.

**Bad Bishop Trade** (Rule 5 + Rule 2): your Bishop is bad when it shares the same color as your own pawns. The Bad Bishop IS the Worst Piece. Trade it for the opponent's good Bishop.

**Space Advantage** (Rule 2 Exception): when your advantage is SPACE, refuse exchanges — every trade relieves their congestion. This is the exception to Rule 2.

**The Principle of Two Weaknesses**: one weakness can always be defended. Two separated weaknesses cannot both be defended simultaneously. Create one weakness first, pressure it until the opponent's pieces are fully committed, then open a second weakness on the opposite side.

**The Second Front**: when attacking one flank, the opponent concentrates all defense there. Open a second front on the opposite flank simultaneously. Build the first threat patiently, then launch the second front when the defense is fully committed elsewhere.

**Alekhine's Gun** (Rule 1 Maximum): double both Rooks on an open file, then place the Queen behind them (R-R-Q formation). The Queen is protected and unexposed. Use to penetrate the 7th or 8th rank.

**Fortress Defense**: a defensive technique where the inferior side builds an impregnable structure that cannot be broken despite material disadvantage. Key recognition: if the opponent has no entry square for their King or pieces, stop trying to win material and build the Fortress.

**Initiative vs Compensation — Fine Distinction**:
- Initiative: you have a series of forcing moves that keep the opponent defensive. Initiative is temporary — it expires the moment you stop forcing.
- Compensation: you have sacrificed material for a permanent structural or positional advantage. Compensation is durable.
- The error: treating initiative as compensation. Ask — if the forcing moves stop right now, is my position actually better? If yes, it is compensation. If no, it is only initiative and you must keep attacking or the sacrifice was unsound.

**Sacrifice Only When the Position Is Ripe** (Rule 3): never enter a speculative sacrifice. A sacrifice is only sound when CCT confirms it is mathematically clean.

**Overprotection** (Nimzowitsch): defend critical squares and pieces more than strictly necessary — before they are attacked. A piece defended twice requires two simultaneous attacks to dislodge.

**Restriction**: limit the mobility of enemy pieces without capturing them. Advance pawns to close lines the enemy Bishop uses; place pieces on squares the enemy Knight needs; create pawn chains that permanently deny the enemy King activity.

**Transformation of Advantage**: an advantage is only useful if it can be converted into a win. The chain: Development lead → launch attack before it evaporates → gain material or structural advantage → simplify into a winning endgame. Each link must be executed before the advantage transforms into equality.

### Conceptual Opening — Capablanca's 3 Pillars

Play the opening without memorizing excessive theory by applying three concepts every move:
1. **Centre**: control d4/d5/e4/e5 — pieces in the center defend each other.
2. **King Safety**: castle within 10 moves — stop the opponent's attack before it starts.
3. **Development**: every move activates a new piece — build the connected web.

By move 10: all pieces developed, King castled, Rooks connected.

**Tempo rule**: every opening move must gain time, space, or development. Never move the same piece twice without a concrete forcing reason.

### Endgame Core — Mathematical Truths

**Rule of the Square**: mental geometry to determine if the King can intercept a passed pawn without assistance.

**Opposition**: using the King to block the enemy King from advancing. The player with opposition controls the critical squares.

**Key Squares** (Pawn Endgames): every pawn has specific Key Squares — if your King reaches one, the pawn promotes regardless of where the opponent's King is. Before calculating moves, identify the key square first.

**Triangulation**: a King maneuver that loses a tempo deliberately to put the opponent in Zugzwang. The King takes 3 moves to return to its starting square (a triangle) while the opponent's King can only take 2. Only Kings can triangulate.

**Zugzwang**: a position where any move you make worsens your situation. Triangulation is the technique to force Zugzwang when direct opposition is not available.

**Lucena Position**: the definitive winning technique in Rook + Pawn vs. Rook endgames — build a bridge with the Rook to shelter the King.

**Philidor Position**: the definitive drawing technique when down a pawn in Rook endgames — control the 6th rank to limit the enemy King.

**Rook Activation (Rubinstein Principle)**: an active Rook placed BEHIND a passed pawn controls it from a distance and supports its advance simultaneously. A Rook placed IN FRONT of its own passed pawn blocks it. In any Rook endgame, the first question is: are my Rooks active or passive?

**The Do Not Hurry Principle** (Shereshevsky): in a won endgame, the most common error is premature conversion — pushing a passed pawn before the position is fully prepared. Correct technique: improve every piece to its optimal square FIRST. Activate the King, centralize Rooks, fix all enemy weaknesses, cut off the enemy King. Then advance.

**The Active King Principle** (Shereshevsky): the King is a strong piece in the endgame. The player who activates their King first typically wins. As soon as Queens come off, march the King toward the center or the nearest weakness immediately.

---

## Section V — Advanced Evaluation and Patterns (Document 2)

### Silman's Complete Imbalance System

| Imbalance | How to Create It | How to Exploit It |
|---|---|---|
| Superior Pawn Structure | Force doubled, isolated, or backward pawns via exchanges | Blockade weak pawns, use Rooks on open files, target with King in endgame |
| Space Advantage | Control center, advance pawns without overextending | Maneuver pieces freely, open second front, restrict opponent's pieces |
| Open Files / Diagonals | Pawn breaks, piece exchanges to clear lines | Double Rooks, place Bishops on long diagonals, penetrate 7th rank |
| Development Lead | Develop all pieces before opponent, castle early | Launch tactical attack before opponent completes development |
| Bishop Pair | Avoid trading Bishops for Knights in open positions | Open the position with pawn breaks |
| Knights vs Bishops | Close the position if you have Knights | Place Knights on outposts, restrict Bishop with pawns on same color |
| Weak Squares | Force opponent's pawns to advance past weak squares | Occupy with Knight outpost, aim all pieces at the weakness |

### Convertibility Assessment

- **Material advantage**: convertible when you can exchange all pieces into a winning pawn endgame. Not convertible when the opponent has Fortress resources or wrong-colored Bishop draw.
- **Positional advantage**: convertible when you can open the position to activate your better pieces OR create a second weakness. Not convertible when the position is completely blocked.
- **Initiative**: never directly convertible — must be used immediately to gain material or a permanent positional advantage.
- **Practical vs Theoretical advantage**: an advantage exists in two forms. Theoretical: the engine confirms you are better. Practical: a human can convert it over the board within the time control. These are NOT always the same. A +0.5 endgame advantage with 10 seconds remaining is theoretically winning and practically drawn.
- **The Two-Weakness Principle in conversion**: if the opponent can defend one weakness perfectly, you cannot convert. Create a second weakness on the opposite side. Only when two separated weaknesses exist simultaneously does conversion become possible against accurate defense.

### Advanced Positional Sacrifice Patterns

**The Exchange Sacrifice (Rook for Minor Piece)**: sacrifice a Rook for a Bishop or Knight when the positional compensation is permanent. Classic indicators: your Knight reaches an unassailable 6th rank outpost; the opponent's Rook becomes permanently passive; you gain a passed pawn on the open file. Study Petrosian's games.

**The Positional Pawn Sacrifice**: surrender a pawn permanently for long-term piece activity, a strong outpost, or open lines. Compensation materializes over 10–20 moves.

**The Bishop Sacrifice on h6 (Bxh6)**: sacrifice on h6 when: you have a Rook on the h-file; the opponent's King has no safe escape; your pieces can quickly coordinate.

**The Minority Attack Sacrifice**: sacrifice a pawn to accelerate the attack on the backward pawn, forcing open the c-file or b-file.

### Advanced Pawn Structures

**The Isolated Queen's Pawn (IQP) — Both Sides**:
- When YOU have the IQP: use the open files aggressively; activate pieces to their maximum; attack before the endgame where the IQP becomes a weakness.
- When OPPONENT has the IQP: blockade it with a Knight on d5; trade off the opponent's active pieces; steer toward an endgame where the IQP is a pure weakness.

**The Carlsbad Structure**: arises from the Exchange variation of the Queen's Gambit. White's plan: Minority Attack (b4-b5) to create a backward c6 pawn. Black's plan: Kingside attack via ...f5-f4 or piece activity through the e4 square. Plans are fixed and non-negotiable.

**The Maroczy Bind**: White pawns on c4 and e4 against Black's Sicilian setup. Completely controls d5. Black's plan: eventual ...d5 or ...b5 break. If Black never achieves the break, White wins by space suffocation.

**The Hanging Pawns Battle**: Owner's plan: advance one pawn to gain space and open lines. Opponent's plan: fix both pawns by attacking them simultaneously. Advance when you have piece activity to support it.

**The Sicilian Dragon Structure**: Black's g7 Bishop is the Dragon's soul — White's primary goal is often to eliminate it (Bh6). White's plan: kingside attack (f4-f5) or the English Attack (Be3, Qd2, 0-0-0). Never play a slow defensive move in a Dragon; every tempo matters.

**The King's Indian Structure**: White controls the center (e4, d4), Black plans a kingside attack. Black's plan: Nf6-h5-f4, pawn storm with ...g5-g4. White's plan: d5 advance or c5 to attack Black's pawn base. Both plans are commitments — the player who executes their plan first typically wins.

**The Benoni Structure**: Black pawn on c5, White pawn on d5 — permanent White space advantage. White's plan: queenside expansion (b4-b5). Black's plan: ...b5 or kingside attack with ...f5-f4. If Black never achieves either break, White wins by space suffocation.

**The Stonewall**: pawns on c3, d4, e3, f4 (White) or c6, d5, e6, f5 (Black). Controls e5 completely but permanently weakens e4 and creates a bad Bishop. The compensation: the e5 outpost is extremely strong if a Knight reaches it and cannot be evicted.

**The Hedgehog**: Black setup with pawns on a6, b6, d6, e6 against White's space advantage. Black waits for ...b5 or ...d5 break when White overextends. White must be positionally precise — the Hedgehog punishes impatient attacks.

**The Ram** (Kmoch): two pawns of opposite colors that have locked against each other on the same file. Closes lines and favors the side with better piece mobility on the remaining open files. A ram is a strategic commitment — it changes the character of the game permanently.

### Advanced Endgame Techniques

**Bishop vs Knight Endgames**:
- Bishop wins in: open positions with passed pawns on both flanks.
- Knight wins in: closed positions with all pawns on one side.
- The side that can open the position wins — Bishop side should open, Knight side should keep it closed.

**The Breakthrough**: in King and Pawn endgames with pawns on both sides: a pawn sacrifice to create a passed pawn that cannot be stopped. Verify it wins before executing.

**Same-Color Bishop Draw**: when both sides have a Bishop of the same color, the game is almost always drawn — the defending King moves between two squares the attacking Bishop cannot access.

**Opposite-Colored Bishops — Middlegame vs Endgame Distinction** (Nunn):
- In the ENDGAME: strong drawing tendency — the defending Bishop can never be attacked or exchanged.
- In the MIDDLEGAME: the opposite — the attacking side's Bishop attacks squares the defending Bishop cannot cover, creating a permanent attacking advantage.
- Rule: if you are attacking with opposite-colored Bishops, press aggressively. If you are in a Rook + opposite-colored Bishop endgame and defending, build a Fortress.

---

## Section VI — Your Repertoire

*Selected based on AliouneBT's 4,241 Chess.com games to maximize existing win rates.*

| Scenario | Opening | Key Move | Why It Fits |
|---|---|---|---|
| White (vs any 1...e5) | Ruy Lopez — Exchange Variation | 4.Bxc6! | Rule 2 on move 4. Damages Black pawn structure. Forces a winning pawn endgame. |
| Black vs 1.e4 | French Defense — Advance / Winawer | 1...e6 → d5 | Ultimate Connectivity opening. Pawn fortress. Trade bad Bishop for good Bishop. Wait, then simplify. |
| Black vs 1.d4 | Nimzo-Indian Defense | 3...Bb4 | Pins White's knight. Forces doubled pawns — same structural goal as Ruy Exchange. |

**Stop Playing**: Leonardis Variation (1.e4 e5 2.d3), Mieses Opening (1.d3), King's Pawn b3 lines, Staunton-Cochrane vs Sicilian. Passive, connectivity-breaking, actively losing rating points. Game data confirms it.

### White: Ruy Lopez Exchange — Strategic Goal
Trade the Bishop for the Knight on move 4 (Bxc6). Black's c-pawns are doubled. Trade every piece off the board. The pawn endgame is mathematically winning for White due to the healthy pawn structure. You are not attacking — you are executing a structural algorithm.

**Document 2 depth — Closed Ruy Lopez**: beyond the Exchange Variation, learn the main tabiya after 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.0-0 Be7 6.Re1 b5 7.Bb3 d6 8.c3 0-0 9.h3. Learn the plans, not the moves — the Knight maneuver to f5 or d5, preparation and execution of d4, the grinding endgame conversion.

**Against the Berlin**: the Berlin endgame (after 4.0-0 Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8) — White's advantage is technical: King activity, passed e5 pawn, Bishop pair. Study Kramnik's games in this structure specifically.

### Black vs e4: French Defense — Strategic Goal
Build the pawn fortress: f7-e6-d5. Over-protect the chain. Your bad light-squared Bishop is your one structural liability — trade it for White's good Bishop using ...Ba6 (Advance) or ...Bb4 (Winawer). Once traded, you are structurally winning. Simplify toward a winning endgame under Rule 2.

**Document 2 depth — Winawer (3.Nc3 Bb4)**: after 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7, Black has permanently doubled White's c-pawns. Plans: attack c3 pawn chain with Qa5 and Bd7; prepare ...f6 to undermine e5; use the Bishop pair in an endgame if the position opens.

**Classical Variation (3.Nc3 Nf6 4.Bg5)**: after 4...Be7 5.e5 Nfd7 6.Bxe7 Qxe7 7.f4, Black's plan is ...c5, ...Nc6, ...f6 to undermine White's center.

**Advance Variation (3.e5 c5)**: learn the plans after 4.c3 Nc6 5.Nf3 Qb6: attack on b2, ...Bd7-Bb5 to trade Bishops, ...f6 to undermine e5.

### Black vs d4: Nimzo-Indian — Strategic Goal
Pin White's c3-Knight immediately with Bb4. Force White to decide: allow doubled pawns (you win structurally) or avoid Nc3 (you take center control). Either way, Rule 1 disruption — their connectivity is broken before the game truly begins.

**Document 2 depth**:
- Classical Variation (4.Qc2): White avoids doubled pawns. After 4...0-0 5.a3 Bxc3+ 6.Qxc3, Black must use piece activity to compensate for the Bishop pair White gains. Plan: ...d5, ...c5 to undermine d4.
- Rubinstein Variation (4.e3): solid and classical. After 4...0-0 5.Bd3 d5 6.Nf3, Black aims for ...dxc4 Bxc4 ...c5 to create IQP positions.
- Sämisch Variation (4.f3): aggressive — White intends e4. Black must react sharply: 4...d5 5.a3 Bxc3+ 6.bxc3 c5 7.cxd5 Nxd5 to create counterplay.

### Anti-Systems Against Unusual Openings

**Against the London System (1.d4 2.Nf3 3.Bf4)**: play ...d5, ...Nf6, ...e6, ...Bd6 — the classical setup. Exchange your Bd6 for White's Bf4. Then play ...c5 to challenge White's center.

**Against the Grand Prix Attack vs Sicilian (1.e4 c5 2.Nc3 then 3.f4)**: fight for the center immediately. 2...Nc6 3.f4 e6 4.Nf3 d5. Do not be passive — active central counterplay immediately.

**Against 1.b4 (Sokolsky/Polish)**: play 1...e5 — take the center immediately. After 2.Bb2 f6, Black has a solid center.

**Against 1.f4 (Bird's Opening)**: play 1...d5 — the classical response.

**Against the Trompowsky (1.d4 Nf6 2.Bg5)**: play 2...Ne4 — attack the Bishop immediately. After 3.Bf4 c5, Black creates immediate counterplay.

**Against the King's Indian Attack (1.Nf3 d5 2.g3)**: play your normal French setup: 2...Nf6 3.Bg2 e6 4.0-0 Be7 5.d3 0-0 6.Nbd2 c5. You are playing a reversed French structure with an extra tempo.

---

## Section VII — Deep Calculation (Document 2+3)

### 5–7 Ply Standard (Document 2)

Document 1 established 3-ply calculation with 100% accuracy. At the Expert/FM level, the standard is 5–7 plies in forced positions.

**Tree Pruning — Candidate Management at Depth**:
- Refutation mindset: for every candidate move, immediately search for the opponent's strongest refutation. If found quickly, discard the candidate and move on. Do not calculate a losing line to its end — stop at the refutation.
- Forcing moves only at depth: beyond 3 plies, calculate ONLY Checks, Captures, and direct Threats. The moment a move is non-forcing, evaluate the position statically and stop.
- The Critical Position: identify the critical position in the line — the moment where the character of the game fundamentally changes. Calculate precisely to that point, then evaluate statically. Do not calculate beyond the critical position unless a new forcing sequence begins there.
- Horizon Effect prevention: the Horizon Effect occurs when a disaster sits just beyond your calculation depth. Counter: in any position where your candidate gives the opponent a large, active piece, extend calculation by 1–2 extra plies before evaluating.

**Calculation in Specific Position Types**:
- Forced mating sequences: no depth limit. Calculate every check until checkmate or a clearly drawn position.
- King and Pawn endgames: calculate every variation completely — there are no quiet positions. Use Key Squares and Opposition as evaluation shortcuts.
- Sacrificial positions: find the opponent's most stubborn defensive resource first. If the sacrifice works against the best defense, it is sound.

### 10+ Ply Calculation — The Kotov Tree Method (Document 3)

From *Think Like a Grandmaster* — the most important calculation framework available.

- **Candidate generation first**: before calculating any line, identify the complete list of candidate moves. Do not calculate Candidate 1 until the full list exists. The first move your intuition proposes is a reflex, not a candidate. Force 2–4 candidates every time.
- **Exhaust one branch completely**: calculate Candidate 1 fully before touching Candidate 2. Never jump between branches mid-calculation.
- **Anti-Kotov rule**: once a branch is calculated and evaluated, never recalculate it. Your second pass through the same line will not be better than the first.
- **Hendriks calibration**: the Kotov system describes how expert calculation is organized from the outside. GMs do not literally apply the algorithm consciously — the structure runs automatically through internalized pattern recognition. When the system starts feeling automatic, you are progressing, not failing.

---

## Section VIII — Database and Opponent Preparation (Document 2)

### Tools

- **Lichess Database** (free): search any player's games by username. Filter by opening ECO code, time control, color.
- **ChessBase** (paid, industry standard): the most complete database tool. Use the Reference function to see all games from any position. Use the Player Dossier for complete opponent profiles.
- **Chess.com Game Archive**: every game available. Export as PGN and import into any analysis tool.

### Opponent Preparation Workflow — 5 Steps

Run this before every rated game (30–60 minutes). Documented as "dramatically increases practical results."

1. **Opening Tree**: find all games of the opponent as White and as Black. Identify their most played openings (ECO codes with more than 5 games).
2. **Deviation Point**: in their most played lines, find where they deviate from main theory. Prepare a specific response to their deviation.
3. **Weakness Pattern**: look at their losses. Where do they blunder? Which structure do they consistently mishandle? Steer the game toward those structures.
4. **Prepare a Novelty**: in your main opening against them, find a position where theory ends or where they deviate. Prepare a specific novelty — a new move that creates problems they have not faced. Test it with an engine first.
5. **Know Their Strengths**: identify what they do well. Avoid those structures. Rule 7 applies: make the game as uncomfortable as possible for them specifically.

**At GM level — add**: a specific novelty prepared against this specific opponent on this specific day is a significant competitive weapon. Do not reveal it in any game before this one.

### Using Claude as a Preparation Partner (Document 3 — Section 3C)

Claude can function as a preparation partner for strategic understanding. The method: describe the specific position you want to prepare, ask for analysis of the strategic themes from both sides, identify critical move junctions, and work through candidate novelties by discussing the positional logic.

The limitation: Claude does not have access to real-time tournament databases and cannot replace ChessBase for novelty verification. Use Claude for positional understanding and strategic preparation. Use ChessBase or Lichess database for theoretical depth and line verification. The two tools are complementary, not equivalent.

---

## Section IX — Engine-Assisted Analysis

### The Correct Analysis Workflow

**Analyze yourself first — always**: before any engine, analyze the game yourself for a minimum of 20 minutes. Write down your assessment of every critical position: who is better, what the plans are, where you went wrong. This is not optional — it is the single highest-return training activity available. Players who analyze their own games with genuine self-diagnosis improve faster than those who study general material.

**Compare, do not replace**: where your analysis agrees with the engine — you understood the position correctly, reinforce that pattern. Where it disagrees — investigate why. The engine's move is the answer. Your task is to understand the question.

**Ask why, not what**: when the engine suggests a move you did not consider, do not memorize it. Ask: what tactical or positional element does this move address that I missed? Label it using the framework. This labeling converts individual game errors into pattern library updates.

**Critical positions only**: identify the 3–5 critical positions in the game — the moments where the evaluation changed significantly. Analyze those positions in depth. Do not perform move-by-move engine checking — it creates passive learning and the habit of outsourcing evaluation.

### Engine Training Drills

**Guess the Move**: play through a GM game of your opening system move by move. Before revealing each move, commit to your choice and explain why. Track your accuracy percentage over time.

**Handicap Analysis**: set the engine to a specific Elo (2200, 2400, 2600). Play a complex position against it. When you lose, identify exactly which move lost the game and why.

**Critical Position Drilling**: extract the 5 most critical positions from your lost games over the past month. Set them up and solve them as puzzles without engine assistance. Commit to an answer before checking.

---

## Section X — Training Pipeline

The difference between a club player and a Master is not talent — it is the quality and consistency of the training method.

### Daily Tactics — Pattern Recognition

**Thematic Puzzles**: do NOT use random Puzzle Rush. Solve 50 consecutive puzzles of a single theme (Pins today, Deflections tomorrow, Batteries the day after). This builds dedicated neural folders — not a random assortment of memories. Quantity without theme or repetition is noise.

**Studies (Deep Calculation)**: composed positions — not typical puzzles. Unlike normal puzzles where you rely on familiar patterns, studies force you to calculate deeply without a familiar pattern to guide you. They sharpen visualization and teach you to find resources in seemingly hopeless positions. Use specifically if you struggle with deep calculation.

**The Woodpecker Method**: solve a large set of puzzles (500–1000). Then solve the entire set again. And again. Each pass you solve them faster. Not about memorizing solutions — it is about repeatedly recognizing the same patterns until recognition becomes instantaneous. Build your set from your own blunder patterns, then drill it cyclically.
- Cycle 1: no time limit (mark failures).
- Cycle 2: three minutes per puzzle.
- Subsequent cycles: reduce to 30 seconds.
- A puzzle is mastered when solved correctly in under 30 seconds every pass — remove it from the set and replace with new blunder patterns. Maintain set size at 500–800 puzzles.

### Game Study — Chunking

**Master Games — Archive, Don't Learn**: play through 5–10 Grandmaster games in your openings (Ruy Lopez Exchange, French Defense) each week at fast pace. Do not stop to analyze deeply. You are not studying the moves; you are archiving the positions into your pattern library. The goal is to recognize where pieces belong instinctively, not to remember the specific moves.

**10 GM games reviewed weekly** (Document 3): fast pace — 30 seconds per position. Not analyzed, archived. Flood the pattern library with positions from your opening systems.

### Time Control

Play 15-minute games exclusively for training. Bullet breaks the CCT habit. Blitz barely allows it. Rapid (10–15 min) forces the discipline.

Blitz: entertainment, not training. Bullet: no training value above 2200 except as a warm-up. The patterns bullet reinforces — fast pattern matching, reflex moves, time pressure tricks — are the opposite of what serious chess requires. Do not use for training.

**Ratio**: for every hour of Blitz or Rapid, at least two hours of Classical play or serious study.

### Mental Game — Psychology and Tilt

**After a blunder**: do not replay the mistake in your head. Acknowledge it in one second, reset, and treat the new position as a fresh problem. The position after the blunder is the only reality. One blunder does not lose a game. Tilt after the blunder does.

**Against slow opponents**: use their time to run the full Section I scan independently of the clock. A slow opponent is free preparation time.

**Time pressure**: under 2 minutes — stop calculating deeply, apply Rule 1 and Rule 3 only. A connected, non-blundering move played quickly beats a perfect move played after flagging.

**After a loss**: do the autopsy within 1 hour while the position is still clear in your mind. Label the root cause. Add the pattern to your Woodpecker set.

### Autopsy Workflow (After Every Game)

1. **Blunder Identification**: find the exact move where the centipawn evaluation dropped sharply.
2. **Root Cause Label**: assign one label: LPDO missed / CCT failed / Prophylaxis skipped / Connectivity broken / Wrong position type classified.
3. **Pattern File**: keep a running note of your 3 most common blunder types. Drill those specific puzzle themes.

### The Three Candidate Rule

This single habit is responsible for an estimated +200 rating points when applied consistently. Never play the first move your eye lands on. Force yourself to identify two alternatives before calculating any of them.

### Practical Clock Management

**2-Minute Rule**: on any move in the transition phase (moves 10–20), spend a minimum of 2 minutes running the full algorithm. These are the highest-risk moves in every game.

**5-Second Floor**: never play any move in under 5 seconds unless in severe time trouble. Instant moves are reflex moves. Reflex moves break rules.

**5-Minute Rule for Critical Decisions** (Documents 2 and 3): any move that permanently changes the pawn structure, sacrifices material, or enters a forcing sequence requires a minimum of 5 minutes. These decisions cannot be reversed. Pawn moves are permanent. Sacrifices cannot be undone. Budget the clock accordingly from move 1.

---

## Section XI — Tournament Psychology

### Pre-Game Protocols

**Preparation without over-preparation**: study your opponent's games the night before but stop 2 hours before the game. Over-preparing creates rigidity — you are looking for your prepared line instead of playing the position in front of you. Preparation is background context, not a script.

**Physical state**: sleep quality is the single most important factor in calculation depth and emotional regulation. Below 7 hours per night, calculation accuracy drops measurably. During tournaments: 8–9 hours. This is the highest-return performance investment available.

**Night shift constraint (direct impact)**: the Maxi schedule (22:30–7h) creates a structural conflict with serious tournament chess. One night shift before a tournament round can cost 50–100 Elo points in effective performance. Plan tournament scheduling around this explicitly — do not play important tournament games after consecutive night shifts without rest.

**Opening mindset**: walk to the board with a clear structural goal for the first 12 moves. Know what position type you are targeting. After move 12, switch to full Algorithm mode.

### During the Game

**The 5-minute commitment rule**: any move that permanently changes the pawn structure, sacrifices material, or enters a forcing sequence requires a minimum of 5 minutes.

**The emotional reset after a blunder**: one blunder does not lose a game. Tilt after the blunder does. The protocol: acknowledge the error in one second, treat the new position as a fresh problem with no emotional history.

**Against higher-rated opponents**: higher-rated players are not playing better moves in the abstract — they are making better decisions from the same positions you see. The board is equal for both players. Apply Rule 7: find the practically difficult move for this specific opponent.

**Draw offers**: offer a draw when you are clearly worse with no practical chances, or when your tournament situation makes a draw advantageous. Refuse a draw when you have any objective advantage, when the position is unclear and you have more time, or when your opponent is in time pressure. Never offer a draw out of fear.

**Flagging avoidance**: never let yourself fall below 3 minutes in a classical game without a clear plan. Below 3 minutes: emergency protocol — Rules 1 and 3 only.

### Rowson's Seven Deadly Chess Sins (Document 3)

These are errors of mental state, not errors of knowledge. Recognizing them in real time is a skill that must be developed.

1. **Thinking too much**: excessive conscious calculation interfering with intuitive pattern recognition. At GM level, trained intuition is often more accurate than conscious analysis. The skill is knowing when to think deeply and when to trust the trained system.
2. **Blinking**: avoiding complications that should be entered out of fear of error. Kasparov's defining quality was his absolute refusal to blink — he entered complications even when uncertain. Learn to recognize when you are avoiding a correct sacrifice or attack because of discomfort.
3. **Wanting**: playing the position you wish was on the board rather than the one that exists. Your plan was to attack the kingside. The position changed. You attack the kingside anyway. The most common error above 2000 and requires active monitoring during the game.
4. **Materialism**: overvaluing material relative to activity and initiative. The exchange sacrifice (Rook for Bishop) and the positional pawn sacrifice remain the primary test — players still find it emotionally difficult to give up material even when the compensation is concretely superior.
5. **Egoism**: playing on in a drawn position because you believe you should be winning. Or refusing to simplify because the position should be better than it is. The ego overrides the objective evaluation. Accept the draw.
6. **Perfectionism**: spending 45 minutes on a move that requires 10. The perfect becomes the enemy of the good. Rule 7 (Practical Decision Making) is the counter: find the practically difficult move, not the engine's first choice.
7. **Looseness**: playing a move without complete focus — the assumption that you can return to this position later with the same quality of attention. You cannot. Every critical position requires full presence.

### Post-Game and Tournament Resilience

**The 10-minute immediate debrief**: within 10 minutes after the game, write down your thoughts raw: what was your plan, where did you feel uncertain, where did the clock pressure affect your decisions. This unfiltered self-assessment reveals your thinking process in a way engine analysis cannot.

**Engine analysis the next day**: analyze with an engine after a night of rest. You will be more objective and less defensive about your decisions.

**The 24-hour rule**: after a loss, a missed win, or a collapse — allow the emotion for 24 hours. After that, process it analytically. Carrying emotional residue into the next game is the primary cause of tournament collapses.

**Tournament schedule management**: in a long tournament (9+ rounds), energy management is as important as preparation. Do not analyze too deeply on rest days before difficult rounds. Protect sleep at all costs. In the final rounds where you have already achieved your goal (a norm, a rating gain), play solid and clinical rather than ambitious.

---

## Section XII — Physical and Mental Performance (Document 3)

A GM tournament (9 rounds over 9 days) is physiologically demanding. Research on competitive chess players shows caloric burn comparable to athletes during tournament play.

### Sleep

The non-negotiable. Sleep quality directly determines calculation depth, pattern recognition speed, and emotional regulation. Below 7 hours per night, calculation accuracy drops measurably. During tournaments: 8–9 hours. This is the highest-return performance investment available and it costs nothing.

### Exercise

Fischer swam and played tennis. Kasparov trained regularly. Carlsen plays football. Aerobic exercise increases cerebral blood flow, improves executive function (the same prefrontal cortex processes used in calculation), and reduces cortisol. 30–45 minutes of aerobic activity on rest days during tournaments is a measurable performance enhancer.

### Nutrition During Long Games

The brain uses glucose as its primary fuel. During a classical game lasting 5+ hours, blood glucose management is a real performance variable. Complex carbohydrates rather than sugar prevent the insulin spikes that cause concentration drops. Adequate hydration — dehydration of even 1–2% body weight impairs cognitive performance measurably.

### Attention Training

The ability to direct attention precisely and sustain it under distraction is trainable. 10–20 minutes of focused attention training daily (meditation, breathwork, or specific concentration exercises) creates measurable improvements in the quality of concentration during long games. The goal is not peace — it is precision of attention.

---

## Section XIII — Career Architecture (Document 3)

### FIDE Rating System and Norm Structure

**NM to FM (2000–2300)**: open tournaments, national championships, online rated games in long time controls. Volume matters — 100+ classical rated games per year accelerates development. No norm structure required, just reaching the rating threshold.

**FM to IM (2300–2400)**: three IM norms required, each in a tournament of 9+ games where your performance rating exceeds 2450. Select tournaments with strong fields — you need 2400+ rated opponents to earn norms.

**IM to GM (2400–2500+)**: three GM norms required, each above 2600 performance threshold, plus reaching 2500 on the rating list. GM norm tournaments have specific composition requirements — a minimum percentage of GMs and IMs. Research FIDE regulations before selecting tournaments.

### The Champion Philosophy Framework (Document 3)

Every great player operates from a unified chess philosophy. Read their games not to memorize moves but to identify the beliefs driving every decision.

| Champion | Core Philosophy | What to Absorb |
|---|---|---|
| Capablanca | Simplicity is strength. The player who needs fewer resources to win is stronger. | Simplification technique, endgame precision, making chess look easy |
| Alekhine | Every position contains latent energy. The winner releases it first. | Long-range planning, dynamic combinations, attacking from quiet positions |
| Botvinnik | Chess mastery is a science. Preparation and method beat talent. | Training systems, opening preparation as middlegame preparation |
| Petrosian | Prevention is more efficient than reaction. Stop the plan before it starts. | Exchange sacrifices, prophylaxis at 5–10 moves depth, making opponents feel helpless |
| Karpov | Accumulate. One small advantage, maintained and increased over 40 moves, wins. | Positional squeeze, piece activity vs material, converting microscopic advantages |
| Fischer | Preparation plus relentlessness. Know your openings deeper than anyone. | Opening depth, zero tolerance for imprecision, converting technical endgames |
| Tal | Practical difficulty matters more than theoretical correctness. | Creating positions where correct defense is humanly impossible, initiative as a weapon |
| Kasparov | Preparation + aggression + will = supremacy. Attack with knowledge. | Integration of tactics and strategy, preparation specificity, competitive intensity |
| Carlsen | Chess is not over until it is over. Find practical chances in objectively drawn positions. | Endgame technique, practical decision-making, persistence |

### The Three Books You Must Read (Document 3)

These do not teach chess techniques. They teach how mastery is built, maintained, and expressed under pressure.

1. **The Art of Learning — Josh Waitzkin**: the clearest account of how technical knowledge becomes intuition through the right kind of practice. His concept of "investment in loss" — deliberately placing yourself in uncomfortable positions during training so that discomfort is not threatening during competition — is the foundation of deliberate practice at this level.

2. **The Seven Deadly Chess Sins — Jonathan Rowson**: a GM and psychologist. His analysis of the seven errors that prevent strong players from performing at their ceiling cannot be adequately paraphrased. Identify which sins are yours specifically.

3. **Think Like a Grandmaster — Alexander Kotov**: the candidate moves system in full depth. Read once at 2000 level, read again at 2300 level — the same passages reveal different things at different stages of development.

---

## Section XIV — The Transcendence Path (Document 3)

### What Actually Changes at Each Level

**NM (2000–2200) — The Competent Practitioner**: the NM applies rules correctly but inconsistently. Loses not because they don't know the rules but because concentration breaks in 1 position per game. Path to FM: reduce inconsistency, not learn new chess.

**FM (2200–2300) — The Reliable Analyst**: can identify the correct plan in most positions. Ceiling: lacks calculation depth and opening preparation depth to compete with IMs consistently. Path to IM: opening depth to move 15+, Dvoretsky endgame manual, calculation drills to 6–8 plies in forcing positions.

**IM (2300–2400) — The Deep Analyst**: calculates accurately to 6–8 plies in forcing positions. Endgame technique is reliable. Can beat GMs. Ceiling: the gap between IM and GM is qualitative, not quantitative. GMs do not know more chess — their understanding is compressed into a different cognitive register.

**GM (2500+) — The Intuitive Master**: operates primarily from intuition and calls on deep calculation only when the position is genuinely complex. The rules are no longer a checklist — they are part of how the board is perceived.

### The Intuition Leap

Every GM who has described the transition from IM to GM uses essentially the same language: a moment when the board stopped looking like pieces and started looking like patterns.

**Chunking compression**: the FM sees 32 pieces. The GM sees 4–5 super-chunks — groups of pieces forming structural patterns that can be evaluated as units. The GM's chunk library contains 50,000+ patterns (research estimates) versus 1,000–5,000 for strong club players.

**How to develop it**: volume and repetition. There is no shortcut. Fischer studied 3,000+ games before reaching mastery. 10 GM games per day reviewed at fast pace — not analyzed deeply but played through quickly to expose the pattern recognition system to new positions. The goal is flooding the library, not deep understanding of each game.

**The aesthetic sense**: develop an aesthetic sense for chess positions — learn to recognize which positions feel right and which feel wrong. When a position feels wrong and you cannot immediately identify why, that feeling is your pattern library signaling an imbalance your conscious analysis has not yet identified. Trust it. Investigate it.

---

## Section XV — Stage-by-Stage Learning Path

Follow the stages in order. Do not move to the next stage until the current one feels natural.

**Stage 1 — The Foundation (Week 1–2)**
Learn the 5 Golden Rules by heart. Focus on Rule 1 and Rule 3 first — Connectivity and CCT. Apply in every 15-minute game. 
*Passage criterion*: you automatically check Rule 1 and Rule 3 before touching a piece without needing to remind yourself.

**Stage 2 — The Scan (Week 3–4)**
Add Section I Tactical Elements only. Start with Fork, Pin, Double Check — 50 thematic puzzles each. Practice Interrupt vs Poll concept. Add one tactical element per week through thematic puzzles.
*Passage criterion*: you can scan for LPDO, Forks, and Pins within the first 10 seconds of your turn without consciously reminding yourself.

**Stage 3 — The Algorithm (Week 5–6)**
Add Section III. Learn the Sequential CCT. Practice the 3 Candidate habit in every game. Begin Blindfold Spatial Sprints (5 minutes after each game session). Begin endgame fundamentals: Rule of the Square, basic Opposition, Key Squares.
*Passage criterion*: you consistently run Checks → Captures → Maneuvering in order without skipping or reversing steps, and no longer play the first candidate you see.

**Stage 4 — Classification and Evaluation (Week 7–8)**
Add Section II. Learn the 4 Evaluation Criteria in order. Learn to classify positions (Firefight/Maneuver/Race). Add core Positional Elements: Bad Bishop, Outposts, Color Complexes, Space, Open Files.
*Passage criterion*: you can look at any position and immediately name the position type and which of the 4 Criteria gives one side the advantage.

**Stage 5 — The Pattern Library (Week 9–16)**
Tactical themes in order: Fork → Pin → Double Check → Skewer → Back-Rank Mate → Removing the Defender → Greek Gift → Smothered Mate → Zwischenzug → Deflection → Clearance Sacrifice → Trapped Piece → Windmill. One theme per week, 50 puzzles each. Then build the Woodpecker set and begin cycling. Add strategic themes. Add endgame core (Key Squares and Triangulation before Lucena and Philidor). Begin full blindfold 3-layer system.
*Passage criterion*: Woodpecker set built and running. Autopsy consistently identifies 3–4 tactical themes per game.

**Stage 6 — Repertoire (Ongoing)**
Add Section V. White: Ruy Lopez Exchange. Black vs e4: French Defense (Advance and Winawer). Black vs d4: Nimzo-Indian. Study 5–10 master games per opening. Apply opponent preparation workflow before every rated game.

**Stage 7 — Document 2 (1800+ / Expert level)**
Internalize Rules 6 and 7. Learn Silman's 7 Imbalances. Extend calculation to 5–7 plies in forced positions. Begin deep opening study (Closed Ruy Lopez, French Winawer full theory, Nimzo-Indian main lines). Deepen pawn structure knowledge (IQP, Carlsbad, Maroczy Bind, Dragon, King's Indian, Benoni). Begin serious database preparation.

**Stage 8 — Document 3 (2200+ / FM level)**
Install Shu-Ha-Ri framework. Begin Kotov Tree Method drilling. Board Removal Drill daily. Studies 3+ per week. Read The Art of Learning, The Seven Deadly Chess Sins, Think Like a Grandmaster. Identify your chess philosophy. Plan norm tournament participation. Find a GM coach — the most important resource at this level.

---

## Master Execution Loop — Every Move

| Step | Action | Applies |
|---|---|---|
| 1. SCAN | Run Ray/Orbit scan. Check LPDO. Identify Batteries. Find Worst Piece. | Every move |
| 2. FIREWALL | What is their single best move right now? (Rule 4 — Prophylaxis) | Every move |
| 3. CLASSIFY | Firefight / Maneuver / Race? Who is better by the 4 Criteria? | Every move |
| 4. CANDIDATES | Generate 3 options based on classification. | Every move |
| 5. FILTER | Run And Then What? — CCT sequential on each candidate. | Every candidate |
| 6. DESPERATION | What is their sneakiest cheapo or trap? | Before executing |
| 7. EXECUTE | Does this move maintain Connectivity (Rule 1)? | Final step |

---

## Quick Reference Cheat Sheet

**The 5 Golden Rules**
Rule 1: Every piece defended (Connectivity) · Rule 2: Force trades when ahead in material — refuse trades when ahead in space (Simplification) · Rule 3: CCT scan before every move · Rule 4: Stop their plan before executing yours (Prophylaxis) · Rule 5: Improve your worst piece when no tactics exist

**The 12-Point Hardware Check**
Tactical (6): LPDO → Rays → Orbits → Batteries → Frozen Pieces (Software Lock) → Overworked Defenders (CPU Overload)
Positional (6): Pawn Structure → Piece Status (Bishop Pair, Bad Bishop, Outposts) → Open + Semi-Open Lines → Space → Color Complexes → King Safety

**Position Types**
Type A (Firefight) → CCT calculate · Type B (Maneuver) → Worst Piece upgrade · Type C (Race) → Initiative above all

**Tactical Themes to Master**
Fork · Double Check · Pin · Skewer · Back-Rank Mate · Greek Gift · Smothered Mate · Zwischenzug · Removing the Defender · Clearance Sacrifice · Trapped Piece · Deflection · Windmill · Interference · Desperado

**Strategic Themes**
Overprotection · Restriction · Transformation of Advantage · Pawn Break · Rook on 7th · Minority Attack · Blockade · Principle of Two Weaknesses · Second Front · Alekhine's Gun · Bad Bishop Trade · Fortress Defense · Initiative vs Compensation · Restraint

**Endgame Laws**
Rule of the Square · Opposition · Key Squares · Triangulation · Zugzwang · Lucena (win) · Philidor (draw) · Active King Principle · Do Not Hurry Principle · Rook Activation (Rubinstein)

*AliouneBT Protocol — Documents 1, 2, 3 — Target: 2500+ — 2026*
