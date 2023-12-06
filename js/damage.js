//Calculates damage of an attack
function calcDamage(attacker, target, mult) {
  if (!mult) {
    mult = 1;
  }
  let damage = (attacker.attack / ((target.defense + 100) / 100)) * mult;

  const range = damage * 0.1;
  const randomValue = Math.random() * (2 * range) - range;

  damage = Math.round(damage + randomValue);

  //Damage boosting items
  if (attacker.player) {
    const championBelt = player.items.find(
      (item) => item.name === "championBelt"
    );
    const wallet = player.items.find((item) => item.name === "wallet");

    if (championBelt) {
      damage += Math.ceil(
        damage *
          (0.01 *
            championBelt.stack *
            ((player.currentHP / player.maxHP) * 100))
      );
    }
    if (wallet) {
      const walletBoost = (wallet.stack - 1) * 0.01;
      damage += Math.ceil(player.money * (0.02 + walletBoost));
    }
  }

  const isCrit = isCriticalHit(attacker.critChance);

  //Determines if hit is crit (double damage)
  function isCriticalHit(critChance) {
    let critVal = random100();

    // Item- Padded Armor
    if (target.player) {
      const paddedArmor = player.items.find(
        (item) => item.name === "paddedArmor"
      );

      if (paddedArmor) {
        critVal -= paddedArmor.stack * 5;
      }
    }

    return critVal <= critChance;
  }

  if (isCrit) {
    addMessage("Critical Hit!");
    damage = damage * 2;
  }

  if (damage < 0) {
    damage = 0;
  }

  healthSteal(damage);

  return Math.round(damage);
}

//Resolves applied status effect to character
function resolveStatusEffects(target) {
  let effects = target.effects;

  if (effects.length > 0) {
    const poison = effects?.find((item) => item.type === "poison");
    const burn = effects?.find((item) => item.type === "burn");
    const stunned = effects?.find((item) => item.type === "stun");
    const broken = effects?.find((item) => item.type === "broken");

    if (burn) {
      target.currentHP -= target.maxHP * 0.1;
    }

    if (burn) {
      if (burn.stack > 1) {
        burn.stack--;
      } else {
        effects = effects.filter((item) => item.type !== "burn");
      }
    }

    if (poison) {
      if (poison.stack > 1) {
        poison.stack--;
      } else {
        effects = effects.filter((item) => item.type !== "poison");
      }
      target.speed += target.level;
    }

    if (stunned) {
      if (stunned.stack > 1) {
        stunned.stack--;
      } else {
        effects = effects.filter((item) => item.type !== "stun");
      }
    }
    if (broken) {
      if (broken.stack > 1) {
        broken.stack--;
      } else {
        effects = effects.filter((item) => item.type !== "broken");
      }
      target.armor += target.level;
    }
  }
  updateHealth(turnQueue);
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
    if (effect === "poison") {
      target.speed -= target.level;
    }
    if (effect === "broken") {
      target.armor -= target.level;
    }
    return;
  }

  //For Hero (based on items)
  if (attacker.player && player.items.length > 0) {
    const molotov = attacker.items.find((item) => item.name === "molotov");
    const moonshine = attacker.items.find((item) => item.name === "moonshine");
    const rock = attacker.items.find((item) => item.name === "pointyRock");
    const ballAndChain = attacker.items.find(
      (item) => item.name === "ballAndChain"
    );

    const poison = effects?.find((item) => item.type === "poison");
    const burn = effects?.find((item) => item.type === "burn");
    const stunned = effects?.find((item) => item.type === "stun");
    const broken = effects?.find((item) => item.type === "broken");

    if (molotov) {
      const effectRoll = random100();
      if (effectRoll <= molotov.stack * 10) {
        if (burn) {
          burn.stack++;
        } else {
          effects.push({ type: "burn", stack: 1 });
        }
      }
    }

    if (moonshine) {
      const effectRoll = random100();
      if (effectRoll <= moonshine.stack * 10) {
        if (poison) {
          poison.stack++;
        } else {
          effects.push({ type: "poison", stack: 1 });
        }
        target.speed -= target.level;
      }
    }
    if (rock) {
      const effectRoll = random100();
      if (effectRoll <= rock.stack * 10) {
        if (broken) {
          broken.stack++;
        } else {
          effects.push({ type: "broken", stack: 1 });
        }
        target.armor -= target.level;
      }
    }
    if (ballAndChain) {
      target.speed -= ballAndChain.stack;
    }
  }
}

//Generates a random number between 1 and 100
function random100() {
  return Math.floor(Math.random() * 100) + 1;
}
