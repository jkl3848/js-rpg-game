let turnQueue = [];
let enemies = [];
let playerTarget;

async function combatInit(combatVal) {
  document.removeEventListener("keydown", handleKeyDown);
  enemies = generateEnemies(combatVal);

  const xpToGain = enemies.reduce((sum, obj) => sum + obj.xp, 0);

  turnQueue = [player].concat(enemies);
  turnQueue.sort((a, b) => b.speed - a.speed);

  console.log(turnQueue);

  createCombatElements(enemies);

  while (player.currentHP > 0 && enemies.some((obj) => obj.currentHP > 0)) {
    const currentCharacter = turnQueue.shift();
    let target = null;

    addMessage(`Turn: ${currentCharacter.name}`);
    turnQueue.push(currentCharacter);
    // Show the next two turns in the turn list
    // const nextTwoTurns = turnQueue.slice(0, 2);
    // addMessage(
    //   "Next two turns:",
    //   nextTwoTurns.map((char) => char.name)
    // );

    // resolveStatusEffects(currentCharacter);

    if (currentCharacter.player) {
      await waitForUserAttack();
      target = playerTarget;
    } else {
      target = player;
    }

    attack(currentCharacter, target);

    updateHealth(turnQueue);
  }

  if (player.currentHP > 0) {
    addMessage("You Win!");
    postCombat(xpToGain);
  } else {
    addMessage("You Lose!");
  }
  document.addEventListener("keydown", handleKeyDown);

  const container = document.getElementById("characters");
  container.innerHTML = "";
}

function attack(attacker, target) {
  const damage = calcDamage(attacker, target);

  target.currentHP = target.currentHP - damage;
  if (target.currentHP < 0) {
    target.currentHP = 0;
  }

  addMessage(target.name + " took " + damage + " damage");
  console.log(target + " took " + damage + " damage");

  if (attacker.player) {
    console.log(target);
    //Reset target selection and color
    const targetEl = document.getElementById("char-" + target.combatId);
    targetEl.style.borderColor = "black";
    playerTarget = null;
    const atkBtn = document.getElementById("attackButton");
    atkBtn.disabled = true;
  }
}

function calcDamage(attacker, target) {
  const atkType = 1;
  let damage = attacker.attack * 3 * atkType;

  const range = damage * 0.1;
  // Generate a random value within the range
  const randomValue = Math.random() * (2 * range) - range;

  // Round to the nearest whole number
  damage = Math.round(damage + randomValue);

  const isCrit = isCriticalHit(attacker.critChance);

  function isCriticalHit(critChance) {
    // Generate a random number between 1 and 100
    const randomValue = Math.floor(Math.random() * 100) + 1;

    // Check if the random number is within the crit chance range
    return randomValue <= critChance;
  }

  if (isCrit) {
    addMessage("Critical Hit!");
    damage = damage * 2;
  }

  return damage - target.defense;
}

function setTarget(id) {
  playerTarget = enemies.find((enemy) => enemy.combatId === id);

  const target = document.getElementById("char-" + id);
  target.style.borderColor = "red";

  const atkBtn = document.getElementById("attackButton");
  atkBtn.disabled = false;
}

function resolveStatusEffects(char) {
  let effects = char.effects;

  if (effects.find((item) => item.type === "burning")) {
  }
}

function generateEnemies(combatVal) {
  let enemies = [];
  let enemyCombatVal = 0;
  let combatId = 1;

  while (enemyCombatVal < combatVal) {
    const randomIndex = Math.floor(Math.random() * mobs.length);
    const randomEnemy = structuredClone(mobs[randomIndex]);

    randomEnemy.currentHP = randomEnemy.maxHP;
    randomEnemy.combatId = combatId;

    combatId++;
    enemyCombatVal += randomEnemy.threatLevel;

    // Otherwise, add the random item to the selectedItems array
    enemies.push(randomEnemy);
  }

  return enemies;
}

function addMessage(message) {
  const messageField = document.getElementById("messageField");
  messageField.value += message + "\n";
  messageField.scrollTop = messageField.scrollHeight; // Auto-scroll to the bottom
}

function waitForUserAttack() {
  return new Promise((resolve) => {
    const button = document.getElementById("attackButton");
    button.addEventListener("click", () => {
      resolve();
    });
  });
}

function createCombatElements(list) {
  const container = document.getElementById("characters");

  container.innerHTML = "";

  list.forEach((char) => {
    const healthElement = document.createElement("div");
    healthElement.innerHTML = `<div class='combat-el' id='char-${char.combatId}'><strong>${char.name}</strong>: <div id='char-${char.combatId}-health'>${char.currentHP}/${char.maxHP} HP</div></div>`;
    healthElement.addEventListener("click", () => setTarget(char.combatId));

    container.appendChild(healthElement);
  });
}

function updateHealth(list) {
  console.log(list);
  list.forEach((char) => {
    let healthElement;
    if (char.player) {
      healthElement = document.getElementById("player-hp");
    } else {
      healthElement = document.getElementById(
        "char-" + char.combatId + "-health"
      );
    }
    healthElement.innerHTML = `${char.currentHP}/${char.maxHP} HP`;
  });
}
