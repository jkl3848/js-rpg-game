/*Enemy threat level is set as follows:
+1 per 20 hp
+1 per stat over 6
-1 per stat under 6
+1 per crit chance
*/

export const enemies = () => {
  const store = useMainStore();
  const mobs = [
    {
      name: "slime",
      level: 1,
      maxHP: 100,
      attack: 6,
      defense: 6,
      speed: 8,
      critChance: 0,
      threatLevel: 7,
      scale: {
        maxHP: 20,
        attack: 1.25,
        defense: 1,
        speed: 0.5,
        critChance: 0.1,
        threatLevel: 4,
      },
      spawnLoc: [1],
    },
    {
      name: "rat",
      level: 1,
      maxHP: 50,
      attack: 7,
      defense: 4,
      speed: 10,
      critChance: 0,
      threatLevel: 6,
      scale: {
        maxHP: 15,
        attack: 1.5,
        defense: 1,
        speed: 1,
        critChance: 0.2,
        threatLevel: 4,
      },
      spawnLoc: [1],
    },
    {
      name: "evil moose",
      level: 1,
      maxHP: 300,
      attack: 8,
      defense: 14,
      speed: 8,
      critChance: 1,
      threatLevel: 27,
      scale: {
        maxHP: 20,
        attack: 1,
        defense: 1.5,
        speed: 1,
        critChance: 0.1,
        threatLevel: 4,
      },

      spawnLoc: [1],
    },
    {
      name: "bat",
      level: 1,
      maxHP: 40,
      attack: 12,
      defense: 2,
      speed: 13,
      critChance: 4,
      threatLevel: 10,
      scale: {
        maxHP: 10,
        attack: 2,
        defense: 0.5,
        speed: 1,
        critChance: 0.2,
        threatLevel: 5,
      },

      spawnLoc: [1],
    },
    {
      name: "baby turtle",
      level: 1,
      maxHP: 95,
      attack: 8,
      defense: 8,
      speed: 10,
      critChance: 2,
      threatLevel: 8,
      scale: {
        maxHP: 10,
        attack: 1,
        defense: 1,
        speed: 1,
        critChance: 0.2,
        threatLevel: 4,
      },

      spawnLoc: [1],
    },
    {
      name: "turtle",
      level: 1,
      maxHP: 250,
      attack: 17,
      defense: 15,
      speed: 10,
      critChance: 2,
      threatLevel: 38,
      scale: {
        maxHP: 20,
        attack: 1.5,
        defense: 1.5,
        speed: 1,
        critChance: 0.2,
        threatLevel: 6,
      },

      spawnLoc: [1],
    },
    {
      name: "big turtle",
      level: 1,
      maxHP: 500,
      attack: 25,
      defense: 22,
      speed: 10,
      critChance: 2,
      threatLevel: 66,
      scale: {
        maxHP: 40,
        attack: 2,
        defense: 1.5,
        speed: 1,
        critChance: 0.2,
        threatLevel: 7,
      },

      spawnLoc: [1],
    },
  ];

  const bosses = [
    {
      name: "stoneKnight",
      level: 1,
      maxHP: 5000,
      attack: 20,
      defense: 25,
      speed: 14,
      critChance: 3,
      threatLevel: 100,
      scale: [25, 50, 2, 2, 0.5, 1],
      spawnLoc: [1],
    },
  ];

  //Generates combat units based on stats and combat value
  function generateEnemies(combatVal) {
    let enemies = [];
    let enemyCombatVal = 0;
    let combatId = 1;
    let levelUp = false;
    const mobSize = Math.floor(Math.random() * (4 - 1 + 1) + 1);

    let bannedEnemies = [];

    while (enemyCombatVal < combatVal) {
      //Dont allow more than 4 enemy units. If still a big combat gap, then level them up
      if (
        enemies.length === mobSize ||
        enemies.length + bannedEnemies.length >= mobs.length
      ) {
        levelUp = true;
        break;
      }

      //Pick random units that have not been banned (banned units are too strong for current combat level)
      do {
        randomIndex = Math.floor(Math.random() * mobs.length);
      } while (bannedEnemies.includes(randomIndex));

      const randomEnemy = structuredClone(mobs[randomIndex]);

      //Create mobs combat element
      if (randomEnemy.threatLevel + enemyCombatVal <= combatVal * 1.2) {
        setHealthToMax(randomEnemy);
        randomEnemy.combatId = combatId;
        randomEnemy.effects = [];
        randomEnemy.turnCounter = randomEnemy.speed;

        combatId++;
        enemyCombatVal += randomEnemy.threatLevel;

        // Otherwise, add the random item to the selectedItems array
        enemies.push(randomEnemy);
        console.log("added new enemy");
      } else {
        bannedEnemies.push(randomIndex);
      }
    }

    enemies = levelUpEnemies(enemies, enemyCombatVal, combatVal);

    return enemies;
  }

  //Levels up enemy units to meet combat value
  function levelUpEnemies(enemies, enemyCombatVal, combatVal) {
    //Levels up one unit at a time until combat val is met
    while (enemyCombatVal < combatVal) {
      for (let i = 0; i < enemies.length; i++) {
        if (enemyCombatVal < combatVal) {
          let scale = enemies[i].scale;

          enemies[i].level++;
          for (let attr in scale) {
            enemies[i][attr] += scale[attr];
            setHealthToMax(enemies[i]);
          }
          enemyCombatVal += scale["threatLevel"];
        }
      }
    }

    return enemies;
  }

  return {
    mobs,
    bosses,
    generateEnemies,
    levelUpEnemies,
  };
};

export default enemies;
