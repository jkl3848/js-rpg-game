let player = {
  name: "Jake",
  player: true,
  combatId: 0,
  level: 1,
  xp: 0,
  money: 0,
  currentHP: 150,
  maxHP: 150,
  attack: 12,
  defense: 12,
  speed: 10,
  critChance: 1,
  evasion: 0,
  items: [],
  scale: [15, 1, 1, 1, 0],
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
      desc: "Increase defense by 50% on the next turn",
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
];

let levelPoints = 4;
let nextXPLevel = 10;
let oldStats;

function start() {
  updatePlayerHUD();
}

function postCombat(xp) {
  postCombatHeal();
  gainXP(xp);
  gainMoney(xp);

  updatePlayerHUD();
}

function gainXP(xp) {
  addMessage("You gained " + xp + " XP!");
  let textbook = player.items.find((item) => item.name === "textbook");
  if (textbook) {
    xp += (xp * (textbook.boost * textbook.stack)) / 100;
  }
  player.xp += xp;

  if (player.xp >= nextXPLevel) {
    levelUp();

    nextXPLevel += Math.floor((player.level * 10 + player.level) * 1.2);
  }
}

function gainMoney(money) {
  player.money += money;
}

function levelUp() {
  moveLock = true;
  addMessage("You leveled up!");
  // const statScale = player.scale;

  gainItem();

  levelPoints = 4;
  player.level++;

  oldStats = {
    maxHP: player.maxHP,
    attack: player.attack,
    defense: player.defense,
    speed: player.speed,
    critChance: player.critChance,
  };
  // player.maxHP += statScale[0];
  // player.attack += statScale[1];
  // player.defense += statScale[2];
  // player.speed += statScale[3];
  // player.critChance += statScale[4];

  document.getElementById("point-allocator").style = "display:flex;";
  document.getElementById("point-level").innerHTML = "Level" + player.level;
  document.getElementById("point-total").innerHTML = "Points: " + levelPoints;
  document.getElementById("point-maxHP-value").innerHTML = player.maxHP;
  document.getElementById("point-attack-value").innerHTML = player.attack;
  document.getElementById("point-defense-value").innerHTML = player.defense;
  document.getElementById("point-speed-value").innerHTML = player.speed;
  document.getElementById("point-critChance-value").innerHTML =
    player.critChance;

  player.currentHP = player.maxHP;
  addMessage("You are now level " + player.level);
}

function closePointAll() {
  document.getElementById("point-allocator").style = "display:none;";
  moveLock = false;
}

function addAttrValue(prop) {
  if (levelPoints <= 0) {
    return;
  }
  if (prop == "maxHP") {
    player[prop] += 10;
  } else {
    player[prop]++;
    if (prop == "critChance" && player[prop] > 100) {
      player[prop] = 100;
      return;
    }
  }

  document.getElementById("point-" + prop + "-value").innerHTML = player[prop];
  levelPoints--;
  document.getElementById("point-total").innerHTML = "Points: " + levelPoints;
}
function subAttrValue(prop) {
  if (levelPoints == 4) {
    return;
  }
  if (prop == "maxHP") {
    player[prop] -= 10;
  } else {
    if (player[prop] === oldStats[prop]) {
      return;
    }
    player[prop]--;
    if (player[prop] < 0) {
      player[prop] = 0;
      return;
    }
  }

  document.getElementById("point-" + prop + "-value").innerHTML = player[prop];
  levelPoints++;
  document.getElementById("point-total").innerHTML = "Points: " + levelPoints;
}

function updatePlayerHUD() {
  const playerHP = document.getElementById("player-hp");
  playerHP.innerHTML = `${player.currentHP} / ${player.maxHP} HP`;

  const playerXP = document.getElementById("player-xp");
  playerXP.innerHTML = `${player.xp} / ${nextXPLevel} XP`;

  const playerMoney = document.getElementById("player-money");
  playerMoney.innerHTML = `${player.money}C`;

  const playerItems = document.getElementById("player-items");
  playerItems.innerHTML = "";
  player.items.forEach((el) => {
    playerItems.innerHTML += `<span class='item-${el.type}'>${el.displayName}:</span> ${el.stack}`;
  });

  const playerStats = document.getElementById("player-stats");
  playerStats.innerHTML = `ATK: ${player.attack} DEF: ${player.defense} SPD: ${player.speed} CRT: ${player.critChance}%`;
}
