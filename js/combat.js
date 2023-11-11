let turnQueue = [];
let cbtPlayer;
let enemies = [];

function combatInit() {
  console.log("here");
  cbtPlayer = structuredClone(player);
  // cbtPlayer.uuid = uuidv4()
  enemies = [];
  enemies.push(structuredClone(mobs["slime"]));

  // enemies = genCombatIDs(enemies)

  turnQueue = [cbtPlayer].concat(enemies);
  turnQueue.sort((a, b) => b.speed - a.speed);

  console.log(turnQueue);
  //   addMessage(turnQueue);

  while (cbtPlayer.health > 0 && enemies.some((obj) => obj.health > 0)) {
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

    let target = getTarget(currentCharacter);

    attack(currentCharacter, target);
  }
}

function attack(attacker, target) {
  const damage = calcDamage(attacker, target);

  target.health = target.health - damage;

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

function genCombatIDs(enemies) {
  for (let i = 0; i < chars.length; i++) {
    enemies[i].uuid = uuidv4();
  }

  return enemies;
}

function addMessage(message) {
  const messageField = document.getElementById("messageField");
  messageField.value += message + "\n";
  messageField.scrollTop = messageField.scrollHeight; // Auto-scroll to the bottom
}
