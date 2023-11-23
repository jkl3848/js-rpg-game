//Calculates damage of an attack
function calcDamage(attacker, target, mult) {
  if (!mult) {
    mult = 1;
  }
  let damage = attacker.attack * 3 * mult;

  const range = damage * 0.1;
  const randomValue = Math.random() * (2 * range) - range;

  damage = Math.round(damage + randomValue);

  const isCrit = isCriticalHit(attacker.critChance);

  //Determines if hit is crit (double damage)
  function isCriticalHit(critChance) {
    const randomValue = random100();

    return randomValue <= critChance;
  }

  if (isCrit) {
    addMessage("Critical Hit!");
    damage = damage * 2;
  }

  damage -= target.defense;

  if (damage < 0) {
    damage = 0;
  }

  healthSteal(damage);

  return damage;
}

//Resolves applied status effect to chars
function resolveStatusEffects(char) {
  if (char.effects?.length > 0) {
    let effects = char.effects;

    if (effects.find((item) => item.type === "burn")) {
      char.currentHP -= char.maxHP * 0.1;
    }
  }
}

//Adds stack of a status to a char
function applyStatusEffect(attacker, target, effect, effectStack) {
  const effects = target.effects;

  //Force apply a specific effect
  if (effect) {
    let thisEffect = effects?.find((item) => item.type === effect);
    if (thisEffect) {
      thisEffect.stack += effectStack;
    } else {
      target.effects.push({ type: effect, stack: effectStack });
    }
    return;
  }

  //For Hero (based on items)
  if (attacker.player && player.items.length > 0) {
    let molotov = attacker.items.find((item) => item.name === "molotov");
    let moonshine = attacker.items.find((item) => item.name === "moonshine");

    let poison = effects?.find((item) => item.type === "poison");
    let burn = effects?.find((item) => item.type === "burn");

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
}

//Generates a random number between 1 and 100
function random100() {
  return Math.floor(Math.random() * 100) + 1;
}
