const commonItems = [
  {
    name: "brokenWatch",
    boost: 5,
    stackBoost: 5,
    boostType: "add",
    target: "self",
    attr: "critChance",
    desc: "Its right twice a day",
    detailedDesc: "Adds a 5% (+5% per stack) critical chance",
  },
  {
    name: "barbedBat",
    boost: 5,
    stackBoost: 5,
    boostType: "add",
    target: "self",
    attr: "attack",
    desc: "",
    detailedDesc: "Adds a 5 (+5 per stack) to attack",
  },
  {
    name: "treeBark",
    boost: 10,
    stackBoost: 5,
    boostType: "add",
    target: "self",
    attr: "hp",
    desc: "",
    detailedDesc: "Recover 5 (+5 per stack) hp after combat",
  },
];

const uncommonItems = [
  {
    name: "mirroredSunglasses",
    boost: 5,
    stackBoost: 5,
    boostType: "mult",
    target: "self",
    attr: "evasion",
    desc: "So shiny",
    detailedDesc: "Adds a 5% (+5% per stack) chance to evade an enemy attack",
  },
  {
    name: "textbook",
    boost: 5,
    stackBoost: 5,
    boostType: "mult",
    target: "self",
    attr: "xp",
    desc: "Filled with knowledge",
    detailedDesc: "Gain 5% (+5% per stack) more experience",
  },
  {
    name: "molotov",
    boost: 10,
    stackBoost: 10,
    boostType: "",
    target: "enemy",
    attr: "effect",
    desc: "Shaken not stirred",
    detailedDesc: "Gain 10% (+10% per stack) chance to inflict BURN on enemy",
  },
  {
    name: "moonshine",
    boost: 10,
    stackBoost: 10,
    boostType: "",
    target: "enemy",
    attr: "effect",
    desc: "Homemade",
    detailedDesc: "Gain 10% (+10% per stack) chance to inflict POISON on enemy",
  },
  {
    name: "sneakers",
    boost: 10,
    stackBoost: 10,
    boostType: "mult",
    target: "self",
    attr: "walking",
    desc: "",
    detailedDesc: "Adds a 10% (+10% per stack) movement speed in the overworld",
  },
  {
    name: "",
    boost: 0.5,
    stackBoost: 0.5,
    boostType: "mult",
    target: "self",
    attr: "health",
    desc: "",
    detailedDesc: "Heal for 0.5% (+0.5% per stack) health per damage dealt",
  },
];

const rareItems = [
  {
    name: "finalFight",
    boost: 1,
    stackBoost: 1,
    boostType: "mult",
    target: "self",
    attr: "damage",
    desc: "Do not go quietly into the night",
    detailedDesc:
      "Deals an additional 1% damage (+1% per stack) for each 1% of missing health",
  },
  {
    name: "shinobiMask",
    boost: 25,
    stackBoost: 15,
    boostType: "mult",
    target: "self",
    attr: "",
    desc: "",
    detailedDesc:
      "Gain 50% (+15% per stack) chance to get a free attack at the start of combat",
  },
  {
    name: "joker",
    boost: 0,
    stackBoost: 0,
    boostType: "flat",
    target: "self",
    attr: "",
    desc: "Faster than fast",
    detailedDesc: "Reroll for an item once per chest",
  },
  {
    name: "ballAndChain",
    boost: 1,
    stackBoost: 1,
    boostType: "add",
    target: "enemy",
    attr: "speed",
    desc: "Faster than fast",
    detailedDesc: "Reduce enemy speed by 1 (+1 per stack) each attack",
  },
  {
    name: "tbd",
    boost: 1,
    stackBoost: 1,
    boostType: "heal",
    target: "self",
    attr: "health",
    desc: "Faster than fast",
    detailedDesc:
      "10% chance (+5% per stack) to recover 5% health (+5% per stack) after attacking",
  },
];

const legendaryItems = [
  {
    name: "wingedBoots",
    boost: 20,
    stackBoost: 5,
    boostType: "add",
    target: "self",
    attr: "speed",
    desc: "Faster than fast",
    detailedDesc: "Gain 20 (+5 per stack) speed",
  },
  {
    name: "tbd",
    boost: 50,
    stackBoost: 5,
    boostType: "mult",
    target: "self",
    attr: "",
    desc: "Faster than fast",
    detailedDesc: "Gain 50% (+5% per stack) chance to attack twice",
  },
  {
    name: "turtleneck",
    boost: 0,
    stackBoost: 0,
    boostType: "flat",
    target: "self",
    attr: "def",
    desc: "",
    detailedDesc:
      "When health drops below 10% (+5% per stack) you will be immune to the next attack. Occurs 1 per combat.",
  },
];
