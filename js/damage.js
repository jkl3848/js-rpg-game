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

  healthSteal(damage);

  return damage - target.defense;
}

function resolveStatusEffects(char) {
  let effects = char.effects;

  if (effects.find((item) => item.type === "burn")) {
    char.currentHP -= char.maxHP * 0.1;
  }
}

function applyStatusEffect(attacker, target) {
  //For Hero (based on items)
  if (attacker.player) {
    let effects = target.effects;
    let molotov = attacker.items.find((item) => item.name === "molotov");
    let moonshine = attacker.items.find((item) => item.name === "moonshine");

    let poison = effects.find((item) => item.type === "poison");
    let burn = effects.find((item) => item.type === "burn");

    if (molotov) {
      if (burn) {
        burn.stack++;
      } else {
        target.effects.push({ type: "burn", stack: 1 });
      }
    } else {
      if (burn) {
        if (burn.stack > 1) {
          burn.stack--;
        } else {
          target.effects = target.effects.filter(
            (item) => item.type !== "burn"
          );
        }
      }
    }

    if (moonshine) {
      if (poison) {
        poison.stack++;
      } else {
        target.effects.push({ type: "poison", stack: 1 });
      }
      target.speed--;
    } else {
      if (poison) {
        if (poison.stack > 1) {
          poison.stack--;
        } else {
          target.effects = target.effects.filter(
            (item) => item.type !== "poison"
          );
        }
        target.speed++;
      }
    }
  }
  //For mobs
}
