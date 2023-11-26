function start() {
  clearAllOverlays();
  moveLock = false;

  createHero();
  updatePlayerHUD();
  updateBackpack();
}

function gameOver() {
  clearAllOverlays();
  addMessage("You Lose!");
  document.getElementById("startButton").disabled = false;
  moveLock = true;

  document.getElementById("overlay").style.display = "flex";
  document.getElementById("game-over").style.display = "block";
}

function scrollHeroes(value) {
  document.getElementById("class-info-" + heroIndex).style.display = "none";
  heroIndex += value;
  if (heroIndex > classes.length - 1) {
    heroIndex = 0;
  } else if (heroIndex < 0) {
    heroIndex = classes.length - 1;
  }
  document.getElementById("class-info-" + heroIndex).style.display = "block";
}

//Functions to run after winning combat
function postCombat(xp) {
  clearAllOverlays();
  //Reset overlay style
  const overlay = document.getElementById("overlay");
  overlay.style.height = "740px";
  overlay.style.top = "0";

  postCombatHeal();
  gainXP(xp);
  gainMoney(xp);

  updatePlayerHUD();
}

//Gain xp for user
function gainXP(xp) {
  let newXPGap;
  addMessage("You gained " + xp + " XP!");
  if (player.class === "professor") {
    xp += Math.ceil(xp * 0.1);
  }
  let textbook = player.items.find((item) => item.name === "textbook");
  if (textbook) {
    xp += (xp * (textbook.boost * textbook.stack)) / 100;
  }
  player.xp += xp;

  if (player.xp >= nextXPLevel) {
    levelUp();

    newXPGap = Math.floor((player.level * 10 + player.level) * 1.2);
    lastXPLevel = nextXPLevel;
    nextXPLevel += newXPGap;
  }

  document.getElementById("current-xp").style.width = `${
    player.xp - lastXPLevel / nextXPLevel - lastXPLevel
  }%`;
}

//Adds money for user
function gainMoney(money) {
  if (player.class === "thief") {
    money += Math.floor(money * 0.15);
  }
  player.money += money;
}

//If the hero has enough xp, level up
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

  //Opens level up ui for point allocation
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("point-allocator").style.display = "block";
  document.getElementById("point-name").innerHTML = player.name;
  document.getElementById("point-level").innerHTML = "Level " + player.level;
  document.getElementById("point-total").innerHTML = "Points: " + levelPoints;
  document.getElementById("point-maxHP-value").innerHTML = player.maxHP;
  document.getElementById("point-attack-value").innerHTML = player.attack;
  document.getElementById("point-defense-value").innerHTML = player.defense;
  document.getElementById("point-speed-value").innerHTML = player.speed;
  document.getElementById("point-critChance-value").innerHTML =
    player.critChance;

  player.currentHP = player.maxHP;
  addMessage("You are now level " + player.level);
  updatePlayerHealth();
}

function closePointAll() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("point-allocator").style.display = "none";
  moveLock = false;
}

function openCombat() {
  const overlay = document.getElementById("overlay");
  document.getElementById("combat-space").style.display = "block";
  moveLock = true;

  overlay.style.display = "flex";
  overlay.style.height = "595px";
  overlay.style.top = "90px";
}

function openBackpack() {
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("backpack-overlay").style.display = "block";
  moveLock = true;
}

function openPlayerMenu() {
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("player-menu").style.display = "block";
  moveLock = true;
}

function clearAllOverlays() {
  moveLock = false;
  document.getElementById("overlay").style.display = "none";
  document.getElementById("backpack-overlay").style.display = "none";
  document.getElementById("point-allocator").style.display = "none";
  document.getElementById("game-over").style.display = "none";
  document.getElementById("player-menu").style.display = "none";
  document.getElementById("combat-space").style.display = "none";
}

function openClassSelector() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("class-picker-container").style.display = "block";
  document.getElementById("class-info-0").style.display = "block";

  moveLock = true;
}

function chooseClass() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("class-picker-container").style.display = "none";
  moveLock = false;

  selectedClass = classes[heroIndex];
  start();
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
  const playerClass = document.getElementById("player-class");
  playerClass.innerHTML = `${
    player.class.charAt(0).toUpperCase() + player.class.slice(1)
  } `;

  const playerName = document.getElementById("player-name");
  playerName.innerHTML = `${player.name}`;

  const playerLevel = document.getElementById("player-level");
  playerLevel.innerHTML = `Level ${player.level}`;

  const playerHP = document.getElementById("player-hp");
  playerHP.innerHTML = `${player.currentHP} / ${player.maxHP} HP`;

  const playerXP = document.getElementById("player-xp");
  playerXP.innerHTML = `${player.xp} / ${nextXPLevel} XP`;

  const playerMoney = document.getElementById("player-money");
  playerMoney.innerHTML = `${player.money}C`;

  const playerStats = document.getElementById("player-stats");
  playerStats.innerHTML = `ATK: ${player.attack} DEF: ${player.defense} SPD: ${player.speed} CRT: ${player.critChance}%`;
}
