let turnQueue = [];
let cbtPlayer;
let enemies = [];

async function combatInit(combatVal) {
  cbtPlayer = structuredClone(player);
  // cbtPlayer.uuid = uuidv4()
  enemies = generateEnemies(combatVal);

  // enemies = genCombatIDs(enemies)

  turnQueue = [cbtPlayer].concat(enemies);
  turnQueue.sort((a, b) => b.speed - a.speed);

  console.log(turnQueue);
  //   addMessage(turnQueue);

  createCombatElements(turnQueue);

  while (cbtPlayer.currentHP > 0 && enemies.some((obj) => obj.currentHP > 0)) {
    const currentCharacter = turnQueue.shift();

    addMessage(`Turn: ${currentCharacter.name}`);
    turnQueue.push(currentCharacter); // Move the current character to the end of the queue
    // turnQueue.sort((a, b) => b.speed - a.speed); // Resort the queue based on speed

    // Show the next two turns in the turn list
    const nextTwoTurns = turnQueue.slice(0, 2);
    // addMessage(
    //   "Next two turns:",
    //   nextTwoTurns.map((char) => char.name)
    // );

    // resolveStatusEffects(currentCharacter);

    let target = getTarget(currentCharacter);

    if (currentCharacter.player) {
      console.log("is player turn");
      await waitForUserAttack();
    }
    attack(currentCharacter, target);

    updateHealth(turnQueue);
  }
}

function attack(attacker, target) {
  const damage = calcDamage(attacker, target);

  target.currentHP = target.currentHP - damage;

  addMessage(target.name + " took " + damage + " damage");
  console.log(target + " took " + damage + " damage");
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

function getTarget(attacker) {
  if (attacker.player) {
    //TODO: Pause and let player choose target
    return enemies[0];
  } else {
    return cbtPlayer;
  }
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
    healthElement.innerHTML = `<strong>${char.name}</strong>: <div id='char-${char.combatId}'>${char.currentHP} HP</div>`;
    container.appendChild(healthElement);
  });
}

function updateHealth(list) {
  console.log(list);
  list.forEach((char) => {
    const healthElement = document.getElementById("char-" + char.combatId);
    console.log(healthElement);
    healthElement.innerHTML = `${char.currentHP} HP`;
  });
}
