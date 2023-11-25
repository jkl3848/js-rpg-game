let player = {
  name: "Jake",
  player: true,
  class: "",
  combatId: 0,
  level: 1,
  xp: 0,
  turnCounter: 0,
  money: 0,
  currentHP: 0,
  evasion: 0,
  items: [],
  scale: [],
  effects: [],
  backpack: [
    {
      name: "potion",
      type: "heal",
      attr: "currentHP",
      boost: 50,
      desc: "heal by 50",
      stack: 2,
    },
  ],
  weapon: "",
};

const classes = [
  {
    name: "knight",
    maxHP: 150,
    attack: 12,
    defense: 12,
    speed: 10,
    critChance: 1,
    secondAbility: {
      name: "For Honor",
      desc: "Deal 1.25x damage and reduce enemy armor by 20%",
      cooldown: 3,
    },
    passive: {
      name: "Dutiful",
      desc: "Heal an extra 5% after combat",
    },
  },
  {
    name: "thief",
    maxHP: 120,
    attack: 15,
    defense: 9,
    speed: 13,
    critChance: 5,
    secondAbility: {
      name: "Dual Slash",
      desc: "Deal .75x damage twice and gain 2 speed",
      cooldown: 3,
    },
    passive: {
      name: "Sticky Finger",
      desc: "Earn 15% more coin",
    },
  },
  {
    name: "guardian",
    maxHP: 180,
    attack: 10,
    defense: 15,
    speed: 7,
    critChance: 0,
    secondAbility: {
      name: "Barrier",
      desc: "Increase defense by 100% on the next turn",
      cooldown: 2,
    },
    passive: {
      name: "Spiked Armor",
      desc: "Enemies take 5% damage given on attack",
    },
  },
  {
    name: "berserker",
    maxHP: 170,
    attack: 14,
    defense: 10,
    speed: 10,
    critChance: 3,
    secondAbility: {
      name: "Rage",
      desc: "Consume 20% HP and gain 20% attack",
      cooldown: 2,
    },
    passive: {
      name: "Bloodlust",
      desc: "Heal 5% on enemy death",
    },
  },
  {
    name: "alchemist",
    maxHP: 120,
    attack: 12,
    defense: 10,
    speed: 14,
    critChance: 1,
    secondAbility: {
      name: "Toxin",
      desc: "Deal .25x damage and apply 3 stacks of POISON to all enemies",
      cooldown: 2,
    },
    passive: {
      name: "Antidote",
      desc: "Immune to POISON",
    },
  },
  {
    name: "professor",
    maxHP: 110,
    attack: 8,
    defense: 11,
    speed: 16,
    critChance: 5,
    secondAbility: {
      name: "Advantage",
      desc: "Stun all enemies for 1 turn",
      cooldown: 3,
    },
    passive: {
      name: "Studious",
      desc: "Gains +10% XP",
    },
  },
];

let levelPoints = 4;
let nextXPLevel = 10;
let oldStats;

//Creates hero based on class
function createHero() {
  //TODO: Need to pick class
  const heroClass = classes[0];

  for (const prop in heroClass) {
    const val = heroClass[prop];
    if (prop === "name") {
      player.class = val;
    } else {
      player[prop] = val;
    }
  }
  player.currentHP = player.maxHP;
  document.getElementById("2ndActionTooltip").innerHTML =
    heroClass.secondAbility.desc;
}
