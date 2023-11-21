const mobs = [
  {
    name: "slime",
    level: 1,
    xp: 10,
    maxHP: 200,
    attack: 5,
    defense: 6,
    speed: 8,
    critChance: 0,
    threatLevel: 5,
    scale: {
      xp: 5,
      maxHP: 20,
      attack: 1,
      defense: 1,
      speed: 0.5,
      critChance: 0.1,
      threatLevel: 1,
    },
    spawnLoc: [1],
  },
  {
    name: "rat",
    level: 1,
    xp: 10,
    maxHP: 150,
    attack: 7,
    defense: 4,
    speed: 10,
    critChance: 0,
    threatLevel: 7,
    scale: {
      xp: 5,
      maxHP: 15,
      attack: 2,
      defense: 1,
      speed: 1,
      critChance: 0.2,
      threatLevel: 1,
    },
    spawnLoc: [1],
  },
  {
    name: "evil moose",
    level: 1,
    xp: 15,
    maxHP: 400,
    attack: 8,
    defense: 14,
    speed: 6,
    critChance: 1,
    threatLevel: 16,
    scale: {
      xp: 8,
      maxHP: 30,
      attack: 1,
      defense: 2,
      speed: 1,
      critChance: 0.1,
      threatLevel: 2,
    },

    spawnLoc: [1],
  },
  {
    name: "bat",
    level: 1,
    xp: 8,
    maxHP: 80,
    attack: 12,
    defense: 2,
    speed: 13,
    critChance: 4,
    threatLevel: 10,
    scale: {
      xp: 4,
      maxHP: 5,
      attack: 2,
      defense: 0.5,
      speed: 1,
      critChance: 0.5,
      threatLevel: 1,
    },

    spawnLoc: [1],
  },
  {
    name: "baby lizard",
    level: 1,
    xp: 12,
    maxHP: 95,
    attack: 8,
    defense: 8,
    speed: 8,
    critChance: 2,
    threatLevel: 8,
    scale: {
      xp: 6,
      maxHP: 10,
      attack: 1,
      defense: 1,
      speed: 1,
      critChance: 0.2,
      threatLevel: 1,
    },

    spawnLoc: [1],
  },
  {
    name: "lizard",
    level: 1,
    xp: 25,
    maxHP: 350,
    attack: 18,
    defense: 15,
    speed: 13,
    critChance: 4,
    threatLevel: 21,
    scale: {
      xp: 13,
      maxHP: 35,
      attack: 2,
      defense: 2,
      speed: 1,
      critChance: 0.4,
      threatLevel: 2,
    },

    spawnLoc: [1],
  },
  {
    name: "big lizard",
    level: 1,
    xp: 45,
    maxHP: 600,
    attack: 25,
    defense: 22,
    speed: 18,
    critChance: 4,
    threatLevel: 40,
    scale: {
      xp: 20,
      maxHP: 55,
      attack: 3,
      defense: 2,
      speed: 1,
      critChance: 0.4,
      threatLevel: 3,
    },

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
  let levelUp = false;

  let bannedEnemies = [];

  while (enemyCombatVal < combatVal) {
    if (
      enemies.length === 4 ||
      enemies.length + bannedEnemies.length >= mobs.length
    ) {
      levelUp = true;
      break;
    }

    do {
      randomIndex = Math.floor(Math.random() * mobs.length);
    } while (bannedEnemies.includes(randomIndex));

    const randomEnemy = structuredClone(mobs[randomIndex]);

    console.log(randomEnemy);

    if (randomEnemy.threatLevel + enemyCombatVal <= combatVal * 1.2) {
      randomEnemy.currentHP = randomEnemy.maxHP;
      randomEnemy.combatId = combatId;
      randomEnemy.effects = [];

      combatId++;
      enemyCombatVal += randomEnemy.threatLevel;

      // Otherwise, add the random item to the selectedItems array
      enemies.push(randomEnemy);
      console.log("added new enemy");
    } else {
      bannedEnemies.push(randomIndex);
    }
  }

  if (levelUp) {
    enemies = levelUpEnemies(enemies, enemyCombatVal, combatVal);
  }

  return enemies;
}

function levelUpEnemies(enemies, enemyCombatVal, combatVal) {
  console.log("leveling up enemies");
  for (let i = 0; i < enemies.length; i++) {
    if (enemyCombatVal < combatVal) {
      let scale = enemies[i].scale;

      enemies[i].level++;
      for (let attr in scale) {
        enemies[i][attr] += scale[attr];
        enemies[i].currentHP = enemies[i].maxHP;
      }
      enemyCombatVal += scale["threatLevel"];
    }
  }
  return enemies;
}
