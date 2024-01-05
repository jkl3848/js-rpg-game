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

    const packItems = player.backpack;
    const onPackItemClick = () => {
      resolve("backpack");
      removeListeners();
    };

    // Add an event listener to each backpack item
    packItems.forEach(function (element) {
      const packEl = document.getElementById(element.name);
      packEl.addEventListener("click", onPackItemClick);
    });

    // Function to remove all event listeners
    function removeListeners() {
      attack.removeEventListener("click", onAttackClick);
      second.removeEventListener("click", onSecondClick);
      flee.removeEventListener("click", onFleeClick);
      packItems.forEach(function (element) {
        const packEl = document.getElementById(element.name);
        packEl.removeEventListener("click", onPackItemClick);
      });
    }
  });
}

function setVisibleTurnOrder() {
  let nextFiveTurns = [];
  let tempQueue = structuredClone(turnQueue);

  const maxTurnCount = turnQueue.reduce(
    (max, obj) => (obj.speed > max.speed ? obj : max),
    turnQueue[0]
  ).speed;

  while (nextFiveTurns.length < 5) {
    const currentCharacter = tempQueue.shift();

    tempQueue.push(currentCharacter);

    currentCharacter.turnCounter += currentCharacter.speed;

    const stunned = currentCharacter.effects?.find(
      (item) => item.type === "stun"
    );
    //If the turn counter reaches the max, take an action
    if (currentCharacter.turnCounter >= maxTurnCount && !stunned) {
      currentCharacter.turnCounter -= maxTurnCount;
      nextFiveTurns.push(currentCharacter);
    } else if (stunned) {
      currentCharacter.turnCounter -= maxTurnCount;
      resolveStatusEffects(currentCharacter);
    }
  }

  const hud = document.getElementById("turn-queue");
  hud.innerHTML = "";

  let counter = 0;

  nextFiveTurns.forEach((el) => {
    const turnElement = document.createElement("div");
    turnElement.className = "turn-queue-char";
    turnElement.id = `turn-char-${el.combatId}`;
    turnElement.textContent = el.name;

    if (playerTarget.combatId === el.combatId) {
      turnElement.classList.add("target-enemy");
    }

    if (el.combatId !== 0) {
      turnElement.addEventListener("click", () => {
        setTarget(el.combatId);
      });
    }

    // Add 'next-turn' class to the first element
    if (counter === 0) {
      turnElement.classList.add("next-turn");
    }

    turnElement.addEventListener("mouseover", () => {
      highlightEnemy(el.combatId);
    });
    turnElement.addEventListener("mouseleave", () => {
      unHighlightEnemy(el.combatId);
    });

    hud.appendChild(turnElement);
    counter++;
  });
}

function highlightEnemy(id) {
  const turnEls = document.querySelectorAll(`#turn-char-${id}`);
  turnEls.forEach((el) => {
    el.classList.add("highlighted-enemy");
  });
  document.getElementById(`char-${id}`)?.classList.add("highlighted-enemy");
}

function unHighlightEnemy(id) {
  const turnEls = document.querySelectorAll(`#turn-char-${id}`);

  turnEls.forEach((el) => {
    el.classList.remove("highlighted-enemy");
  });
  document.getElementById(`char-${id}`)?.classList.remove("highlighted-enemy");
}
