let turnQueue = [];
let enemies = [];
let playerTarget;

async function combatInit(combatVal) {
  moveLock = true;
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

    resolveStatusEffects(currentCharacter);

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

  const container = document.getElementById("characters");
  container.innerHTML = "";
  moveLock = false;
}

function attack(attacker, target) {
  const damage = calcDamage(attacker, target);

  target.currentHP = target.currentHP - damage;
  if (target.currentHP < 0) {
    target.currentHP = 0;
  }

  addMessage(target.name + " took " + damage + " damage");
  console.log(target.name + " took " + damage + " damage");

  applyStatusEffect(attacker, target);

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

function setTarget(id) {
  playerTarget = enemies.find((enemy) => enemy.combatId === id);

  const target = document.getElementById("char-" + id);
  target.style.borderColor = "red";

  const atkBtn = document.getElementById("attackButton");
  atkBtn.disabled = false;
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
