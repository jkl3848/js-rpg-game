//Updates all health elements after combat turn
function updateHealth(list) {
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

//Heals hero after combat
function postCombatHeal() {
  let healTotal;

  healTotal = player.maxHP * 0.05;

  let bark = player.items.find((item) => item.name === "treeBark");
  if (bark) {
    healTotal += 5 * bark.stack;
  }

  player.currentHP += healTotal;

  addMessage("Healed for " + healTotal);
}

function healthSteal(user, target, damage) {}
