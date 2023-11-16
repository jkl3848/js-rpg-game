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
