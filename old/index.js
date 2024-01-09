const gameVersion = "0.4.0";

function clearDataForNewGame() {
  encounterVal = 6;
  heroIndex = 0;
  levelPoints = 4;
  nextXPLevel = 10;
  lastXPLevel = 0;
  secondCooldown = 0;

  document.getElementById("current-xp").style.width = `0%`;
}

function gameOver() {
  clearDataForNewGame();
  clearMessage();
  clearAllOverlays();
  clearCombatOverlay();
  store.gameMessage = "You Lose!";
  document.getElementById("startButton").disabled = false;
  moveLock = true;

  document.getElementById("game-over").style.display = "flex";
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
function postCombat(xp, numberOfEnemies) {
  clearMessage();
  enemiesDefeated++;
  clearAllOverlays();
  clearCombatOverlay();

  postCombatHeal();
  gainXP(xp);

  for (let i = 0; i < numberOfEnemies; i++) {
    if (getRandomNum() <= 10) {
      gainConsumable();
    }
  }

  let coin = xp;
  const check = player.items.find((item) => item.name === "blankCheck");
  if (check) {
    coin += coin * (check.stack * 0.1);
  }

  gainMoney(Math.floor(coin));

  updatePlayerHUD();
}

//Gain xp for user
function gainXP(xp, loop) {
  let newXPGap;
  if (!loop) {
    store.gameMessage = "You gained " + xp + " XP!";
    if (player.class === "professor") {
      xp += Math.ceil(xp * 0.1);
    }
    let textbook = player.items.find((item) => item.name === "textbook");
    if (textbook) {
      xp += Math.floor((xp * (textbook.boost * textbook.stack)) / 100);
    }
    player.xp += xp;
  }
  if (player.xp >= nextXPLevel) {
    levelUp();

    newXPGap = Math.floor((player.level * 10 + player.level) * 1.2);
    lastXPLevel = nextXPLevel;
    nextXPLevel += newXPGap;

    //Loop until no more levels need to be gained
    gainXP(0, true);
  }

  document.getElementById("current-xp").style.width = `${
    ((player.xp - lastXPLevel) / (nextXPLevel - lastXPLevel)) * 100
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
  store.gameMessage = "You leveled up!";

  gainItem();

  levelPoints = 4;
  player.level++;
  player.maxHP += 10;

  oldStats = {
    maxHP: player.maxHP,
    attack: player.attack,
    defense: player.defense,
    speed: player.speed,
    critChance: player.critChance,
  };

  //Opens level up ui for point allocation
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
  document.getElementById("level-up-button");

  setHealthToMax(player);
  store.gameMessage = "You are now level " + player.level;
  updatePlayerHealth();
  updatePlayerHUD();
}

function addAttrValue(prop) {
  if (levelPoints <= 0) {
    return;
  }
  if (prop == "maxHP") {
    player[prop] += 10;
    setHealthToMax(player);
    updatePlayerHealth();
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

  if (levelPoints == 0) {
    document.getElementById("level-up-button").disabled = false;
  }
}
function subAttrValue(prop) {
  document.getElementById("level-up-button").disabled = true;
  if (levelPoints == 4) {
    return;
  }
  if (prop == "maxHP") {
    player[prop] -= 10;
    setHealthToMax(player);
    updatePlayerHealth();
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
