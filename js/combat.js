let turnQueue = [];
let enemies = [];
let playerTarget;
let secondCooldown = 0;

let thiefStartSpeed;
let guardianStartDefense;
let berserkerStartAttack;

let inCombat;

async function combatInit(combatVal) {
  inCombat = true;
  openCombat();

  enemies = generateEnemies(combatVal);
  if (player.class === "thief") {
    thiefStartSpeed = player.speed;
  } else if (player.class === "guardian") {
    guardianStartDefense = player.defense;
  } else if (player.class === "berserker") {
    berserkerStartAttack = player.attack;
  }

  const xpToGain = enemies.reduce((sum, obj) => sum + obj.xp, 0);

  //Sort the initial combat queue by speed
  turnQueue = [player].concat(enemies);
  turnQueue.sort((a, b) => b.speed - a.speed);

  console.log(turnQueue);

  //Generate enemies dom elements
  createCombatElements(enemies);

  //Sets the first enemy as the default target for the user
  setTarget(1);

  //Set turn counter euqal to highest speed in group
  const maxTurnCount = turnQueue.reduce(
    (max, obj) => (obj.speed > max.speed ? obj : max),
    turnQueue[0]
  ).speed;

  //Set hero's turn counter to speed
  turnQueue[0].turnCounter = turnQueue[0].speed;

  //While the hero and at least 1 enemy has health
  while (player.currentHP > 0 && enemies.some((obj) => obj.currentHP > 0)) {
    const currentCharacter = turnQueue.shift();
    let target = null;
    let action;

    turnQueue.push(currentCharacter);
    // Show the next two turns in the turn list
    // const nextTwoTurns = turnQueue.slice(0, 2);
    // addMessage(
    //   "Next two turns:",
    //   nextTwoTurns.map((char) => char.name)
    // );

    currentCharacter.turnCounter += currentCharacter.speed;

    const stunned = currentCharacter.effects?.find(
      (item) => item.type === "stun"
    );
    //If the turn counter reaches the max, take an action
    if (currentCharacter.turnCounter >= maxTurnCount && !stunned) {
      currentCharacter.turnCounter -= maxTurnCount;
      addMessage(`Turn: ${currentCharacter.name}`);

      //First resolve any effects on the acting char
      //TODO: Need to bail if the effects kill the char
      resolveStatusEffects(currentCharacter);

      if (currentCharacter.player) {
        //2nd action cooldown
        if (secondCooldown > 0) {
          secondCooldown--;
          if (secondCooldown == 0) {
            const btn = document.getElementById("2ndActionButton");
            btn.disabled = false;
          }
        }
        //Wait for the user to pick an action before continuing
        action = await waitForUserAttack();
        target = playerTarget;
      } else {
        target = player;
      }

      //Reset guardian defense for 2nd ability
      if (player.class === "guardian") {
        resetStats();
      }

      //Different action types
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

          resetStats(true);
          clearCombatOverlay();
          return;
        }

        addMessage("You failed to flee");
      }

      //Updates all chars health in ui
      updateHealth(turnQueue);

      if (target.currentHP === 0 && !target.player) {
        //If multiple enemies, remove defeated enemy
        if (enemies.length > 1) {
          defeatedEnemy(target);
        }

        if (player.class === "berserker") {
          player.currentHP += Math.ceil(player.maxHP * 0.05);
          balanceHealth();
          updatePlayerHealth();
        }
      }
    } else if (stunned) {
      currentCharacter.turnCounter -= maxTurnCount;
      resolveStatusEffects(currentCharacter);
    }
  }

  resetStats(true);

  const container = document.getElementById("characters");
  container.innerHTML = "";

  inCombat = false;
  turnQueue = [];
  enemies = [];

  if (player.currentHP > 0) {
    addMessage("You Win!");
    postCombat(xpToGain);
  } else {
    gameOver();
  }
}

function defeatedEnemy(enemy) {
  addMessage(`${enemy.name} defeated!`);
  turnQueue = turnQueue.filter((char) => char.combatId !== enemy.combatId);
  enemies = enemies.filter((char) => char.combatId !== enemy.combatId);

  //Regenerate enemies dom elements
  createCombatElements(enemies);

  //Sets the first enemy as the default target for the user
  setTarget(enemies[0].combatId);
}

function resetStats(end) {
  if (end) {
    player.turnCounter = 0;
  }

  if (player.class === "thief") {
    player.speed = thiefStartSpeed;
  } else if (player.class === "guardian") {
    player.defense = guardianStartDefense;
  } else if (player.class === "berserker") {
    player.attack = berserkerStartAttack;
  }
}

//Attacks a target
function attack(attacker, target, damage) {
  if (evadeAttack(target)) {
    return;
  }

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

    if (player.class === "guardian") {
      attacker.currentHP -= Math.ceil(damage * 0.05);
    }
  }

  // if (attacker.player) {
  //   const atkBtn = document.getElementById("attackButton");
  //   atkBtn.disabled = true;
  // }
}

//Sets a new target for the player
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

//Adds message to textfield
function addMessage(message) {
  const messageField = document.getElementById("messageField");
  messageField.value += message + "\n";
  messageField.scrollTop = messageField.scrollHeight; // Auto-scroll to the bottom
}

//Waits for user to click one of the action buttons
function waitForUserAttack() {
  return new Promise((resolve) => {
    const attack = document.getElementById("attackButton");
    const onAttackClick = () => {
      resolve("attack");
      removeListeners();
    };
    attack.addEventListener("click", onAttackClick);

    const second = document.getElementById("2ndActionButton");
    const onSecondClick = () => {
      resolve("second");
      removeListeners();
    };
    second.addEventListener("click", onSecondClick);

    const flee = document.getElementById("fleeButton");
    const onFleeClick = () => {
      resolve("flee");
      removeListeners();
    };
    flee.addEventListener("click", onFleeClick);

    const packItems = document.querySelectorAll(".pack-item");
    const onPackItemClick = () => {
      resolve("backpack");
      removeListeners();
    };

    // Add an event listener to each backpack item
    packItems.forEach(function (element) {
      element.addEventListener("click", onPackItemClick);
    });

    // Function to remove all event listeners
    function removeListeners() {
      attack.removeEventListener("click", onAttackClick);
      second.removeEventListener("click", onSecondClick);
      flee.removeEventListener("click", onFleeClick);
      packItems.forEach(function (element) {
        element.removeEventListener("click", onPackItemClick);
      });
    }
  });
}

//Creates the dom elements for enemies
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

//Decides if user can flee. Starts at 50% chance
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

//2nd actions, different per class
function secondAction(currentCharacter, target) {
  //Knight
  if (player.secondAbility.name === "For Honor") {
    const damage = calcDamage(currentCharacter, target, 1.25);
    attack(currentCharacter, target, damage);

    let defReduce = Math.ceil(target.defense * 0.2);
    if (defReduce < 1) {
      defReduce = 1;
    }

    target.defense -= defReduce;
  }
  //Thief
  else if (player.secondAbility.name === "Dual Slash") {
    const firstAtkDamage = calcDamage(currentCharacter, target, 0.75);
    attack(currentCharacter, target, firstAtkDamage);

    const secondAtkDamage = calcDamage(currentCharacter, target, 0.75);
    attack(currentCharacter, target, secondAtkDamage);

    player.speed += 2;
  }
  //Guardian
  else if (player.secondAbility.name === "Barrier") {
    //TODO: Somehow this needs to reset after the next turn
    player.defense += player.defense;
  }
  //Berserker
  else if (player.secondAbility.name === "Rage") {
    player.currentHP -= Math.ceil(player.maxHP * 0.2);
    player.attack += Math.ceil(player.attack * 1.2);

    updatePlayerHealth();
  }
  //Alchemist
  else if (player.secondAbility.name === "Toxin") {
    let enemyList = turnQueue.filter((item) => !item.player);

    for (let i = 0; i < enemyList; i++) {
      let target = enemyList[i];
      const damage = calcDamage(currentCharacter, target, 0.25);
      attack(currentCharacter, target, damage);
      applyStatusEffect(currentCharacter, target, "poison", 3);
    }
  }
  //Professor
  else if (player.secondAbility.name === "Advantage") {
    let enemyList = turnQueue.filter((item) => !item.player);

    for (let i = 0; i < enemyList; i++) {
      let target = enemyList[i];
      applyStatusEffect(currentCharacter, target, "stun", 1);
    }
  }

  const energyDrink = player.items.find((item) => item.name === "energyDrink");
  secondCooldown = player.secondAbility.cooldown + 1 - energyDrink.stack;

  const btn = document.getElementById("2ndActionButton");
  btn.disabled = true;
}

function evadeAttack(target) {
  const randomNum = random100();

  let evasionChance = target.evasion;

  if (target.player) {
    const sunglasses = player.items.find((item) => item.name === "sunglasses");
    evasionChance += sunglasses.stack * 5;
  }

  if (randomNum <= evasionChance) {
    return true;
  }
  return false;
}
