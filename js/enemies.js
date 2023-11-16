const mobs = [
  {
    name: "slime",
    level: 1,
    xp: 10,
    maxHP: 200,
    attack: 5,
    defense: 5,
    speed: 8,
    critChance: 0,
    threatLevel: 5,
    scale: [5, 20, 1, 1, 0.5, 0],
    spawnLoc: [1],
  },
  {
    name: "rat",
    level: 1,
    xp: 10,
    maxHP: 150,
    attack: 10,
    defense: 4,
    speed: 10,
    critChance: 0,
    threatLevel: 7,
    scale: [5, 15, 2, 1, 1, 1],
    spawnLoc: [1],
  },
];

const bosses = [
  {
    name: "stoneKnight",
    level: 1,
    maxHP: 5000,
    xp: 250,
    attack: 20,
    defense: 25,
    speed: 14,
    critChance: 3,
    threatLevel: 100,
    scale: [25, 50, 2, 2, 0.5, 1],
    spawnLoc: [1],
  },
];

function generateEnemies(combatVal) {
  let enemies = [];
  let enemyCombatVal = 0;
  let combatId = 1;

  while (enemyCombatVal < combatVal) {
    const randomIndex = Math.floor(Math.random() * mobs.length);
    const randomEnemy = structuredClone(mobs[randomIndex]);

    randomEnemy.currentHP = randomEnemy.maxHP;
    randomEnemy.combatId = combatId;

    combatId++;
    enemyCombatVal += randomEnemy.threatLevel;

    // Otherwise, add the random item to the selectedItems array
    enemies.push(randomEnemy);
  }

  return enemies;
}
