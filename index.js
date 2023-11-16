var player = {
  name: "Jake",
  player: true,
  combatId: 0,
  level: 1,
  xp: 0,
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

var itemChance = [50, 35, 12, 3];

function start() {
  updatePlayerHUD();
  // combatInit(12);
}

function postCombat(xp) {
  gainXP(xp);

  updatePlayerHUD();
}

function gainXP(xp) {
  addMessage("You gained " + xp + " XP!");
  player.xp += xp;

  if (player.xp >= player.level * 10) {
    levelUp();
  }
}

function levelUp() {
  addMessage("You leveled up!");
  const statScale = player.scale;

  player.level++;
  player.maxHP += statScale[0];
  player.attack += statScale[1];
  player.defense += statScale[2];
  player.speed += statScale[3];
  player.critChance += statScale[4];

  player.currentHP = player.maxHP;
  addMessage("You are now level " + player.level);

  gainItem();
}

function updatePlayerHUD() {
  const playerHP = document.getElementById("player-hp");
  playerHP.innerHTML = `${player.currentHP} / ${player.maxHP} HP`;

  const playerXP = document.getElementById("player-xp");
  playerXP.innerHTML = `${player.xp} / ${player.level * 10} XP`;

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
