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
  let gauntlet = player.items.find((item) => item.name === "ironGauntlet");

  if (bark) {
    let heal = bark.boost;
    if (bark.stack > 1) {
      heal += bark.stackBoost * bark.stack - 1;
    }
    healTotal += barkBoos;
  }

  if (gauntlet) {
    player.maxHP += gauntlet.stack;
  }

  if (healTotal > 1) {
    healTotal = Math.floor(healTotal);
  } else if (healTotal > 0 && healTotal < 1) {
    healTotal = 1;
  }

  player.currentHP += healTotal;

  addMessage("Healed for " + healTotal);
}

function healthSteal(damage) {
  if (player.items.length > 0) {
    let siphon = player.items?.find((item) => item.name === "siphon");
    if (siphon) {
      player.currentHP += Math.ceil(damage * (siphon.stack / 100));
      addMessage("Healed for " + siphon);
    }
  }
}
