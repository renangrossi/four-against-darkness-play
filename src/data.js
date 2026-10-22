// Page references are PRINTED book pages, pulled from each book's own table of contents.
const BOOKS = {
  "4AD":{f:"4ad-core-book-expanded.pdf",n:"Core rulebook (expanded)"},
  "4AA":{f:"4ad-major-expansion-four-against-the-abyss.pdf",n:"Four Against the Abyss (L5-9)"},
  "NW":{f:"4ad-major-expansion-four-against-the-netherworld.pdf",n:"Netherworld hex-crawl (L6-9)"},
  "FD":{f:"Stand Alone Books/four-against-the-forsaken-depths.pdf",n:"Forsaken Depths (L10-19)"},
  "TDoor":{f:"4ad-suplement-twisted-doors.pdf",n:"Twisted Doors"},
  "TDun":{f:"4ad-suplement-twisted-dungeons.pdf",n:"Twisted Dungeons"},
  "TCav":{f:"4ad-suplement-twisted-caverns.pdf",n:"Twisted Caverns"},
  "TTun":{f:"4ad-suplement-twisted-tunnels.pdf",n:"Twisted Tunnels"},
  "TMin":{f:"4ad-suplement-twisted-minions.pdf",n:"Twisted Minions"},
  "THoard":{f:"4ad-suplement-twisted-hoards.pdf",n:"Twisted Hoards"},
  "TTrap":{f:"4ad-suplement-twisted-traps-and-snares.pdf",n:"Twisted Traps & Snares (outdoor)"},
  "TFF":{f:"4ad-suplement-twisted-final-fights.pdf",n:"Twisted Final Fights (image-only, print it)"},
  "CoC":{f:"4ad-suplement-caverns-of-chaos.pdf",n:"Caverns of Chaos (L3-6)"},
  "DDD":{f:"4ad-suplement-digressions-of-the-devouring-dead.pdf",n:"Devouring Dead (undead)"},
  "RoR":{f:"4ad-suplement-ravagers-of-ruins.pdf",n:"Ravagers of Ruins (L1+)"},
  "CCC":{f:"4ad-suplement-the-crucible-of-classic-critters.pdf",n:"Crucible of Classic Critters (L4+)"},
  "MMM":{f:"4ad-suplement-more-mountainous-mayhem.pdf",n:"More Mountainous Mayhem (L4+)"},
  "LTQ":{f:"4ad-suplement-lost-temples-of-qaarra.pdf",n:"Lost Temples of Qaarra (L6+)"},
  "SSS":{f:"4ad-suplement-swamps-of-the-slithering-snakemen.pdf",n:"Swamps of the Slithering Snakemen"},
  "TTT1":{f:"4ad-suplement-treacheries-of-the-troublesome-towns-tome-i.pdf",n:"Troublesome Towns I (rules)"},
  "TTT2":{f:"4ad-suplement-treacheries-of-the-troublesome-towns-tome-ii.pdf",n:"Troublesome Towns II (tables)"},
  "OWQ":{f:"overland-world-quest-generation-a-fan-made-supplement_vf_revised.pdf",n:"Overland World & Quest Generation"},
  "OA":{f:"overland_adventures.pdf",n:"Overland Adventures"},
  "Atlas":{f:"4ad-suplement-dungeon-atlas-vol1.pdf",n:"Dungeon Atlas Vol.1"},
  "Dozen":{f:"4ad-suplement-the-dreadful-dozen.pdf",n:"Dreadful / Frightful Dozen"}
};

const TIERS = [
  {lv:"1-4",t:1,die:6,exp:6,book:"4AD"},
  {lv:"5-9",t:2,die:8,exp:7,book:"4AA"},
  {lv:"10-14",t:3,die:10,exp:8,book:"FD"},
  {lv:"15-19",t:4,die:12,exp:9,book:"FD"},
  {lv:"20+",t:5,die:20,exp:10,book:"FD"}
];

// Adventure order: phase -> steps [id, do, lookup]
const ORDER = [
 ["A — Before play",[
  ["A1","Build 4 PCs","4AD 8 (choosing) · classes 4AD 19-65"],
  ["A2","Default weapon, armour, Marching Order 1-4","Marching Order 4AD 95"],
  ["A3","Buy gear: lantern + 2 torches (2gp), door wedges 5gp, crowbar 25gp","Lantern 4AD 110 · gear TDoor 16"],
  ["A4","Set the limit: tile count or clock",""],
  ["A5","Open the Major Foe tally","Final Boss 4AD 105"]]],
 ["B — Choose the destination",[
  ["B1","Move a hex, roll terrain","OWQ Overland Hex Generation"],
  ["B2","Roll 2d6 Special Features (road / roadless)","OWQ Special Features"],
  ["B3","Settlement? d6 -> 1-3 Village · 4-5 Town · 6 City","OWQ · town play TTT1"],
  ["B4","Quest? d20 quest -> d6 type -> d6 size -> d6 layout","OWQ Quest Generation"],
  ["B5","Dungeon type -> pick the table set","Environment tab"]]],
 ["C — Enter",[
  ["C1","Roll Dungeon Door Strength d6 once: 1-2 weak · 3-4 average · 5-6 secure","TDoor 2"],
  ["C2","(optional) Roll one dungeon complication","TDun 3-33"],
  ["C3","Roll 1d6 First Room, draw it — NO content roll","Tile generation 4AD 149"]]],
 ["D — Tile loop (repeat)",[
  ["D1","Pick an exit",""],
  ["D2","Door: d6 -> 1-4 material · 5-6 roll d88","TDoor 2-15 · simple 2d6 4AD 109"],
  ["D3","Roll d66 tile shape. 1 sq wide = corridor, 2+ = room","4AD 149"],
  ["D4","Roll 2d6 Tile Content","4AD 152"],
  ["D5","Resolve: fight / trap / treasure / event","4AD 154-156"],
  ["D6","Empty? Search once, mark S","4AD 107 · caverns 4AD 113"],
  ["D7","Repeat. Backtracking = 1-in-6 Wandering Monsters","4AD 104"]]],
 ["E — Encounter",[
  ["E1","Roll the Foe on the environment's table","Environment tab"],
  ["E2","Attack now, or gamble on a Reaction roll","Surprise 4AD 90"],
  ["E3","Order: Foe ranged (if surprised) > PC ranged/spells > Foe melee > PC melee","4AD 91 · flowchart 4AD 146"],
  ["E4","Declare each PC's attack AFTER seeing the last result","4AD 91"],
  ["E5","Assign Foe attacks","4AD 96-97"],
  ["E6","Minor Foes below half -> Morale d6: 1-3 flee, you still get treasure","4AD 95"],
  ["E7","Out: Withdraw (needs a door, +1 Def) or Flee (gear lost on deaths)","4AD 97"]]],
 ["F — Final Boss",[
  ["F1","Each Major Foe: d6 +1 per Major Foe met. 6+ = the Boss","4AD 105"],
  ["F2","Out of grid -> Boss is in the last tile","4AD 105"],
  ["F3","Boss: +1 Life, +1 attack, fights to the death, gold x3 or 100gp, 2 magic items","4AD 105"],
  ["F4","(optional) Escalate","TFF · Final Boss Table play aid"]]],
 ["G — Walk out",[
  ["G1","Every tile back = 1-in-6 Wandering Monsters","4AD 107"],
  ["G2","Secret door shortcut: d6, on a 6 you exit with no WM roll","4AD 108"],
  ["G3","Count XP","4AD 117"]]],
 ["H — Town & next",[
  ["H1","Roll before/after-dungeon events","Random Events play aid"],
  ["H2","Town: light = OWQ Settlement Actions · full = TTT1 + TTT2","hamlets TTT1 21"],
  ["H3","Shop, heal, resurrect (1000gp, can fail)","4AD 105 · 111"],
  ["H4","Level up, spend XP","4AD 117-118"],
  ["H5","Advance the plot, pick the next hex -> back to B","OWQ"]]]
];

const TABLES = {
 tile:{name:"Tile Content (2d6)",ref:"4AD 152",rows:[
  ["2","Treasure"],["3","Trapped treasure — traps THEN treasure"],
  ["4","Corr: empty · Room: Special Event"],["5","Empty + Special Feature, or Secret Passage"],
  ["6","Vermin"],["7","Minions"],["8","Corr: empty · Room: Minions"],
  ["9","Empty; or 2 Clues -> Secret Passage"],["10","Corr: empty · Room: Weird Monster"],
  ["11","Boss"],["12","Corr: empty · Room: dragon's lair"]]},
 search:{name:"Search (d6, -1 in corridors)",ref:"4AD 107",rows:[
  ["0-1","WANDERING MONSTERS"],["2-4","Nothing"],
  ["5-6","Choose: hidden treasure · secret door · secret passage · 1 Clue"]]},
 wander:{name:"Wandering Monsters (d6)",ref:"4AD 107",rows:[
  ["1-2","Vermin"],["3-4","Minions"],["5","Weird Monster"],["6","BOSS"]],
  note:"They attack first; no shield bonus on that roll."},
 doormat:{name:"Door material (d88 11-18)",ref:"TDoor 2-3",rows:[
  ["11","Woven straw · locked 1-in-6 · difficulty 2 · slash/flame auto, NO WM roll"],
  ["12","Tied branches · 1-in-6 · d6+1 · slash/flame auto, 1-in-6 WM"],
  ["13","Wood plank · 2-in-6 · d6+2 · Fireball/Lightning destroy, 1-in-6 WM"],
  ["14","Solid wood · 2-in-6 · d6+2+Tier · as above"],
  ["15","Reinforced wood · 3-in-6 · d6+3+Tier · spells destroy on roll = lock difficulty"],
  ["16","Metal bars · 4-in-6 · pick 5+Tier+d6, bash d6+5 · Lightning -> weathered (#66)"],
  ["17","Solid metal · 5-in-6 · d6+Tier+4 · bashing loud, WM on 1-3"],
  ["18","Stone · always locked · d6+Tier+5 · immune to spells · dwarves +L to bash"]],
  note:"Bash: a roll of 1 brings Wandering Monsters. Crowbar +1, battering ram +1+1d3."},
 attack:{name:"Attack modifiers",ref:"4AD 91 · summary 147",rows:[
  ["Warrior / barbarian / dwarf / elf / paladin","+L"],["Partial martial (cleric)","+1/2 L"],
  ["Cleric vs undead","+L"],["Rogue vs outnumbered Minor Foe","+L"],
  ["Wizard melee","none (+L on spells; light weapons -1)"],
  ["Unarmed","-2"],["No light","-2"],
  ["Two-handed / light / crushing vs skeletons","+1 / -1 / +1"]]},
 defense:{name:"Defense modifiers",ref:"4AD 97 · summary 148",rows:[
  ["Light armour","+1"],["Heavy armour","+2"],["Shield","+1"],["Rogue","+L"],
  ["Dwarf vs troll/giant","+1"],["Halfling vs troll/giant/ogre","+L"]],
  note:"A roll of 1 ALWAYS fails. A 6 is not an auto-success but explodes."},
 attacked:{name:"Who gets attacked",ref:"4AD 96-97",rows:[
  ["Room, Foes < PCs","Each a different PC; you choose who is spared"],
  ["Room, equal","One each"],
  ["Room, Foes > PCs","Spread evenly, you assign extras — EXCEPT Hated classes"],
  ["Corridor","Max 2 Foes, hitting positions 1-2"],
  ["Wandering Monsters in corridor","2 of them hit positions 3-4"]],
  note:"Hatreds: trolls/goblins/kobolds -> dwarves · orcs -> elves · undead -> clerics."},
 xp:{name:"XP (classical)",ref:"4AD 117",rows:[
  ["10 Minor Foe ENCOUNTERS","1"],["Secret revealed (3 Clues)","1"],
  ["Each Major Foe","1"],["Final Boss","+1"]]},
 monsters:{name:"Monster tables — core pages",ref:"4AD 167-186",rows:[
  ["Dungeon","Vermin 167 · Minions 168 · Weird 169 · Boss 170"],
  ["Caverns","Vermin 171 · Minions 172 · Weird 174 · Boss 173"],
  ["Fungal grotto","Vermin 175 · Minions 176 · Weird 178 · Boss 177"],
  ["Fiendish Foes","Vermin 181 · Minions 182 · Weird 184 · Boss 183"]]},
 loot:{name:"Traps & treasure — core pages",ref:"4AD 153-166",rows:[
  ["Traps","Dungeon 164 · Caverns 165 · Fungal 166"],
  ["Treasure","157"],["Magic treasure","Dungeon 158 · Caverns 160 · Fungal 161"],
  ["Special feature","153"],["Special events","Dungeon 154 · Caverns 155 · Fungal 156"],
  ["Quests / Epic rewards","162 / 163"]],
  note:"Outdoor traps: TTrap (d66, wilderness only). Bigger hauls: THoard."},
 conditions:{name:"Conditions",ref:"",rows:[
  ["Rest (once per adventure)","Cleared room, adjacent clear, doors nailed/wedged. +1 Life or 1 ability each, then 1-in-6 WM — 4AD 114"],
  ["Madness","1+ = no equipment trading. Above L = PC gone (wizards L+1). L1-4 may take 2 damage instead — 4AD 113"],
  ["Fallen","Strip gear 1 turn. Carrying a body = auto-hit, no Defense. Resurrect 1000gp, can fail — 4AD 105"],
  ["Petrified","Needs a Blessing. 2 PCs to carry, 2-in-6 WM — 4AD 106"]]}
};

const ENVIRONMENTS = [
 ["Dungeon","4AD","152-170"],["Dungeon — chaos/goblinoid (L3-6)","CoC","tables 11-25, missions 5-9"],
 ["Dungeon — undead","DDD","room contents 87, tables 88-126, tiles 27"],
 ["Cavern","TCav + 4AD","TCav 2-12 · 4AD 112-113, 171-174"],
 ["Fungal grotto","4AD","113, 175-178"],["Tunnels","TTun",""],
 ["Ruins / open air","RoR",""],["Woodland / open sky","CCC",""],
 ["Mountains (L4+)","MMM",""],["Swamp","SSS",""],["Temple (L6+)","LTQ",""],
 ["Under a town","TTT2","Undercity 139-141"],["Abyss (L5-9)","4AA","46-61"]
];

const TOWN = [
 ["Steps of play","TTT1 15"],["Town size · blocks","TTT1 20"],
 ["Hamlet rules (1 block, d6+1 tiles, no Undercity)","TTT1 21"],
 ["True towns (4+ blocks)","TTT1 22"],["Walk the town · map icons","TTT1 25"],
 ["Worked example (hamlet)","TTT1 34"],
 ["Connected Dungeons — run DDD/CoC/TDun in the Undercity","TTT1 74"],
 ["Dungeon Transit — town to dungeon = d6+HCL days","TTT1 77"],
 ["Factions","TTT1 150"],["Vicious Villains","TTT1 166-187 · roster TTT2 144"],
 ["Undercity tables","TTT2 139-141"],["Hamlet flowchart","TTT2 182"],
 ["Villain: Crazy Collector","TTT1 173"],["Villain: Grim Guildmaster","TTT1 176"],
 ["Villain: Hidden Horror","TTT1 179"],["Villain: iNsAnE iNvEnToR","TTT1 181"],
 ["Villain: Warped Warmaster","TTT1 183"],["Villain: Wicked Warlock","TTT1 186"]
];

const TIERUP = [
 ["Stepping into the Abyss","4AA 4"],["Exploding d8s","4AA 4"],
 ["Start a party at L5","4AA 7"],["Minions with leaders","4AA 7"],
 ["Multiple bosses in a room","4AA 9"],["Trial of Champions","4AA 9"],
 ["Hordes","4AA 10"],["Expert Skills","4AA 14-22 · summary 62"],
 ["Turn Undead / Vampire Hunter / Orcslayer","4AA 22 / 22 / 20"],
 ["Hirelings & retainers","4AA 26-33 · costs 64"],
 ["Madness / Vampirism / Dark Plague / Lycanthropy","4AA 34 / 36 / 37 / 39"],
 ["Abyss tables","4AA 46-61"],["Heroic tier rules","FD 2"],["Tier summary table","FD 4"],
 ["Heroic Skills","FD 6-17"],["Heroic Magic","FD 18"],["Legendary Skills","FD 20"]
];

const THUMBS = [
 "Set the tile or time limit BEFORE you start.",
 "Carry spare torches — no light is -2 to everything and no Searching.",
 "Door wedges (5gp, reusable) beat nails (4gp, single use).",
 "Outnumbered? Fight in a corridor. 4 Foes become 2 attacks.",
 "Don't backtrack casually — every re-entered tile rolls on a table with a Boss on it.",
 "Attack one PC at a time, watching each result.",
 "Reaction rolls are a gamble: a Fight result means they swing first.",
 "Search every safe empty tile. Clues are XP and keys; secret doors DOUBLE treasure.",
 "Remember the hatreds — a dwarf in a goblin dungeon soaks every spare attack.",
 "Fleeing works: HCL locks on first contact, so a hard room stays that L when you return.",
 "Budget the walk home. The Boss is not the last fight."
];

// classic script (works from file:// — ES modules do not)
window.FAD = {BOOKS,TIERS,ORDER,TABLES,ENVIRONMENTS,TOWN,TIERUP,THUMBS};
