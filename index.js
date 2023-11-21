function start() {
  createHero();
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

  document.getElementById("overlay").style.display = "flex";
  document.getElementById("point-allocator").style.display = "block";
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
  document.getElementById("overlay").style.display = "none";
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
