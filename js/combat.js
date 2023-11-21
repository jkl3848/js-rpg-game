let turnQueue = [];
let enemies = [];
let playerTarget;
let secondCooldown = 0;

async function combatInit(combatVal) {
  moveLock = true;
  enemies = generateEnemies(combatVal);

  const xpToGain = enemies.reduce((sum, obj) => sum + obj.xp, 0);

  turnQueue = [player].concat(enemies);
  turnQueue.sort((a, b) => b.speed - a.speed);

  console.log(turnQueue);

  createCombatElements(enemies);

  setTarget(1);

  while (player.currentHP > 0 && enemies.some((obj) => obj.currentHP > 0)) {
    const currentCharacter = turnQueue.shift();
    let target = null;
    let action;

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
      if (secondCooldown > 0) {
        secondCooldown--;
        if (secondCooldown == 0) {
          const btn = document.getElementById("2ndActionButton");
          btn.disabled = false;
        }
      }
      action = await waitForUserAttack();
      console.log(action);
      target = playerTarget;
    } else {
      target = player;
    }

    if (action === "attack" || !currentCharacter.player) {
      attack(currentCharacter, target);
    } else if (action === "second") {
      secondAction(currentCharacter, target);
    } else if (action === "flee") {
      const flee = fleeCombat();

      if (flee) {
        addMessage("You successfully fled");
        const container = document.getElementById("characters");
        container.innerHTML = "";
        moveLock = false;
        return;
      }

      addMessage("You failed to flee");
    }

    updateHealth(turnQueue);

    if (target.currentHP === 0) {
      turnQueue = turnQueue.filter((obj) => obj.combatId !== target.combatId);
      console.log(turnQueue);
      addMessage(`${target.name} defeated!`);
    }
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

function attack(attacker, target, damage) {
  if (!damage) {
    damage = calcDamage(attacker, target);
  }

  target.currentHP = target.currentHP - damage;
  if (target.currentHP < 0) {
    target.currentHP = 0;
  }

  addMessage(target.name + " took " + damage + " damage");
  console.log(target.name + " took " + damage + " damage");

  applyStatusEffect(attacker, target);

  if (target.player) {
    let coin = target.items.find((item) => item.name === "rareCoin");

    if (coin) {
      player.money += Math.ceil(damage * (coin.stack / 100));
    }
  }

  // if (attacker.player) {
  //   const atkBtn = document.getElementById("attackButton");
  //   atkBtn.disabled = true;
  // }
}

function setTarget(id) {
  //Reset target selection and color
  const targetEl = document.querySelectorAll(".combat-el");

  targetEl.forEach((el) => {
    el.style.borderColor = "black";
  });

  playerTarget = enemies.find((enemy) => enemy.combatId === id);

  const target = document.getElementById("char-" + id);
  target.style.borderColor = "red";
}

function addMessage(message) {
  const messageField = document.getElementById("messageField");
  messageField.value += message + "\n";
  messageField.scrollTop = messageField.scrollHeight; // Auto-scroll to the bottom
}

function waitForUserAttack() {
  return new Promise((resolve) => {
    const attack = document.getElementById("attackButton");
    attack.addEventListener("click", () => {
      resolve("attack");
    });

    const second = document.getElementById("2ndActionButton");
    second.addEventListener("click", () => {
      resolve("second");
    });

    const flee = document.getElementById("fleeButton");
    flee.addEventListener("click", () => {
      resolve("flee");
    });

    const backpack = document.getElementById("backpackButton");
    backpack.addEventListener("click", () => {
      resolve("backpack");
    });
  });
}

function createCombatElements(list) {
  const container = document.getElementById("characters");

  container.innerHTML = "";

  list.forEach((char) => {
    const healthElement = document.createElement("div");
    healthElement.innerHTML = `<div class='combat-el' id='char-${char.combatId}'><strong>${char.name}</strong>: <div id='char-${char.combatId}-health'>${char.currentHP}/${char.maxHP} HP</div><div>LV: ${char.level}</div></div>`;
    healthElement.addEventListener("click", () => setTarget(char.combatId));

    container.appendChild(healthElement);
  });
}

function fleeCombat() {
  let fleeChance = 50;

  let oil = player.items.find((item) => item.name === "oil");

  if (oil) {
    fleeChance += oil.stack * 10;
  }

  const chance = random100();

  if (chance <= fleeChance) {
    return true;
  }
  return false;
}

function secondAction(currentCharacter, target) {
  if (player.secondAbility.name === "For Honor") {
    const damage = calcDamage(currentCharacter, target, 1.25);
    attack(currentCharacter, target, damage);

    let defReduce = Math.ceil(target.defense * 0.2);
    if (defReduce < 1) {
      defReduce = 1;
    }

    target.defense -= defReduce;
  }

  secondCooldown = player.secondAbility.cooldown + 1;
  const btn = document.getElementById("2ndActionButton");
  btn.disabled = true;
}
