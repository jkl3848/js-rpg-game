let player = {
  name: "Jake",
  player: true,
  combatId: 0,
  level: 1,
  xp: 0,
  money: 0,
  currentHP: 100,
  maxHP: 100,
  attack: 10,
  defense: 10,
  speed: 10,
  critChance: 1,
  evasion: 0,
  items: [],
  scale: [15, 1, 1, 1, 0],
  effects: [],
};

let itemChance = [50, 35, 12, 3];
let levelPoints = 4;
let nextXPLevel = 10;
let oldStats;

function start() {
  updatePlayerHUD();
  // combatInit(12);
}

function postCombat(xp, money) {
  gainXP(xp);
  gainMoney(xp);

  updatePlayerHUD();
}

function gainXP(xp) {
  addMessage("You gained " + xp + " XP!");
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
    playerItems.innerHTML += `${el.name}: ${el.stack}`;
  });

  const playerStats = document.getElementById("player-stats");
  playerStats.innerHTML = `ATK: ${player.attack} DEF: ${player.defense} SPD: ${player.speed} CRT: ${player.critChance}%`;
}

function gainItem() {
  let item = null;

  const itemPoolNumber = Math.floor(Math.random() * 100) + 1;

  let itemPool;

  if (itemPoolNumber <= itemChance[0]) {
    itemPool = commonItems;
  } else if (
    itemPoolNumber > itemChance[0] &&
    itemPoolNumber <= itemChance[0] + itemChance[1]
  ) {
    itemPool = uncommonItems;
  } else if (
    itemPoolNumber > itemChance[0] + itemChance[1] &&
    itemPoolNumber <= itemChance[0] + itemChance[1] + itemChance[2]
  ) {
    itemPool = rareItems;
  } else if (
    itemPoolNumber > itemChance[0] + itemChance[1] + itemChance[2] &&
    itemPoolNumber <=
      itemChance[0] + itemChance[1] + itemChance[2] + itemChance[3]
  ) {
    itemPool = legendaryItems;
  }

  const itemNumber = Math.floor(Math.random() * itemPool.length);

  item = itemPool[itemNumber];
  let itemObj;
  //If the item already exists, then stack it
  if (player.items.find((obj) => obj.name === item.name)) {
    itemObj = player.items.find((obj) => obj.name === item.name);
    itemObj.stack++;
  }
  //otherwise add it
  else {
    itemObj = structuredClone(item);
    itemObj.stack = 1;
    player.items.push(itemObj);
  }

  addMessage("You gained " + item.name);

  applyItemEffect(itemObj);
}

function applyItemEffect(item) {
  if (item.target === "self") {
    let boost;
    if (item.stack == 1) {
      boost = item.boost;
    } else {
      boost = item.stackBoost;
    }
    if (item.boostType == "add") {
      player[item.attr] += boost;
      //Figure out the multiplier
      // } else if (item.boostType == "mult") {
      //   player[item.attr] = player[item.attr] * boost;
    }
  }
  console.log(player);
}
