import { defineStore } from "pinia";
import { useMainStore } from "./mainStore";
import { useSpriteStore } from "./sprites";

import enemyData from "../js/enemies";
import damageFuncs from "../js/damage";
import healthFuncs from "../js/health";
import animation from "../js/animation";

let thiefStartSpeed;
let guardianStartDefense;
let berserkerStartAttack;

export const useCombatStore = defineStore("combat", {
  state: () => {
    return {
      inCombat: false,
      turnQueue: [],
      combatEnemies: [],
      secondCooldown: 0,
      randomEncounter: 200,
      areaEncounterVal: 1,
      encounterVal: 6,
      areaCombatVal: 0,
      playerTarget: {},
      playerTurn: false,
      encounterDetails: {
        maxTurnCount: 0,
        xpToGain: 0,
      },
    };
  },
  actions: {
    async combatInit() {
      const store = useMainStore();
      const sprite = useSpriteStore();
      const enemies = enemyData();

      this.combatEnemies = await enemies.generateEnemies(this.encounterVal);
      // const numberOfEnemies = this.combatEnemies.length;

      sprite.stopOverworldLoop();
      sprite.startCombatCanvas();

      this.inCombat = true;
      sprite.canvasState.overworld = false;
      sprite.canvasState.combat = true;

      if (store.hero.class === "thief") {
        thiefStartSpeed = store.hero.speed;
      } else if (store.hero.class === "guardian") {
        guardianStartDefense = store.hero.defense;
      } else if (store.hero.class === "berserker") {
        berserkerStartAttack = store.hero.attack;
      }

      this.encounterDetails.xpToGain = this.combatEnemies.reduce(
        (sum, obj) => sum + obj.threatLevel,
        0
      );

      //Sort the initial combat queue by speed
      this.turnQueue = [store.hero].concat(this.combatEnemies);
      this.turnQueue.sort((a, b) => b.speed - a.speed);

      console.log(this.turnQueue);

      //Sets the first enemy as the default target for the user
      this.setTarget(1);

      //Set turn counter equal to highest speed in group
      this.encounterDetails.maxTurnCount = this.turnQueue.reduce(
        (max, obj) => (obj.speed > max.speed ? obj : max),
        this.turnQueue[0]
      ).speed;

      //Set hero's turn counter to speed
      this.turnQueue[0].turnCounter = this.turnQueue[0].speed;

      this.combatLoop();
    },

    combatLoop() {
      const store = useMainStore();
      const damage = damageFuncs();
      const health = healthFuncs();

      console.log("Starting combat loop");
      this.playerTurn = false;
      //While the hero and at least 1 enemy has health
      while (
        store.hero.currentHP > 0 &&
        this.combatEnemies.some((obj) => obj.currentHP > 0)
      ) {
        const currentCharacter = this.turnQueue.shift();

        this.turnQueue.push(currentCharacter);

        currentCharacter.turnCounter += currentCharacter.speed;

        const stunned = currentCharacter.effects?.find(
          (item) => item.type === "stun"
        );
        //If the turn counter reaches the max, take an action
        if (
          currentCharacter.turnCounter >= this.encounterDetails.maxTurnCount &&
          !stunned
        ) {
          currentCharacter.turnCounter -= this.encounterDetails.maxTurnCount;

          console.log(`Turn: ${currentCharacter.name}`);

          //First resolve any effects on the acting char
          //TODO: Need to bail if the effects kill the char
          damage.resolveStatusEffects(currentCharacter);

          if (currentCharacter.player) {
            console.log("Players turn");
            this.playerTurn = true;
            //2nd action cooldown
            if (this.secondCooldown > 0) {
              this.secondCooldown--;
            }

            if (store.hero.class === "guardian") {
              this.resetStats();
            }

            //Break loop for user to take action
            break;
          } else {
            this.playerTurn = false;
            setTimeout(() => {
              this.enemyAttack(currentCharacter, store.hero);
            }, "800");
            break;
          }

          //Different action types
          // if (action === "attack") {
          //TODO: these need to be set up for more complicated enemies later
          // } else if (action === "second") {
          //   this.secondAction(currentCharacter, target);
          // } else if (action === "flee") {
          //   const flee = fleeCombat();

          //   if (flee) {
          //     store.gameMessage = "You successfully fled";
          //     const container = document.getElementById("characters");
          //     container.innerHTML = "";

          //     this.resetStats(true);
          //     return;
          //   }

          //   store.gameMessage = "You failed to flee";
          // }
        } else if (stunned) {
          currentCharacter.turnCounter -= this.encounterDetails.maxTurnCount;
          damage.resolveStatusEffects(currentCharacter);
        }
      }

      if (this.combatEnemies.length === 0) {
        this.postCombat();
      }
    },

    postCombat() {
      const store = useMainStore();
      const health = healthFuncs();
      const sprite = useSpriteStore();

      this.resetStats(true);

      this.inCombat = false;
      this.turnQueue = [];
      this.combatEnemies = [];

      if (store.hero.currentHP <= 0) {
        store.gameOver();
      } else {
        store.gameMessage = "You Win!";

        health.postCombatHeal();
        store.gainXP(this.encounterDetails.xpToGain);
        store.gainMoney(this.encounterVal * 5);
        this.encounterDetails.xpToGain = 0;

        sprite.stopCombatLoop();
        sprite.startOverworldCanvas();
      }
    },

    playerPostAction() {
      const store = useMainStore();

      this.checkForZeroHP();

      if (
        store.hero.currentHP > 0 &&
        this.combatEnemies.some((obj) => obj.currentHP > 0)
      ) {
        this.combatLoop();
      } else {
        this.postCombat();
      }
    },

    enemyAttack(enemy, hero) {
      this.attack(enemy, hero);
      this.combatLoop();
    },

    checkForZeroHP() {
      const store = useMainStore();
      const health = healthFuncs();
      //Remove any defeated enemies
      for (let i = 0; i < this.combatEnemies.length; i++) {
        const enemy = this.combatEnemies[i];
        if (enemy.currentHP === 0) {
          //If multiple enemies, remove defeated enemy
          if (this.combatEnemies.length > 1) {
            this.defeatedEnemy(enemy);
          }

          if (store.hero.class === "berserker") {
            store.hero.currentHP += Math.ceil(store.hero.maxHP * 0.05);
            health.balanceHealth();
          }
        }
      }
    },

    defeatedEnemy(enemy) {
      const store = useMainStore();
      const sprite = useSpriteStore();

      store.enemiesDefeated++;
      store.gameMessage = `${enemy.name} defeated!`;

      this.turnQueue = this.turnQueue.filter(
        (char) => char.combatId !== enemy.combatId
      );
      this.combatEnemies = this.combatEnemies.filter(
        (char) => char.combatId !== enemy.combatId
      );
      sprite.enemies = sprite.enemies.filter(
        (item) => item.combatId !== enemy.combatId
      );

      //Sets the first enemy as the default target for the user
      this.setTarget(this.combatEnemies[0].combatId);
    },
    resetStats(end) {
      const store = useMainStore();
      if (end) {
        store.hero.turnCounter = 0;
      }

      if (store.hero.class === "thief") {
        store.hero.speed = thiefStartSpeed;
      } else if (store.hero.class === "guardian") {
        store.hero.defense = guardianStartDefense;
      } else if (store.hero.class === "berserker") {
        store.hero.attack = berserkerStartAttack;
      }
    },
    //Attacks a target
    attack(attacker, target, damageTotal) {
      const store = useMainStore();
      const damage = damageFuncs();
      if (this.evadeAttack(target)) {
        return;
      }

      if (!damageTotal) {
        damageTotal = damage.calcDamage(attacker, target);
      }

      target.currentHP = target.currentHP - damageTotal;
      if (target.currentHP < 0) {
        target.currentHP = 0;
      }

      store.gameMessage = `${
        target.player ? store.heroName : target.name
      } took ${damageTotal} damage`;
      console.log(
        `${
          target.player ? store.heroName : target.name
        } took ${damageTotal} damage`
      );

      damage.applyStatusEffect(attacker, target);

      if (target.player) {
        let coin = target.items.find((item) => item.name === "rareCoin");

        if (coin) {
          store.hero.money += Math.ceil(damageTotal * (coin.stack / 100));
        }

        if (store.hero.class === "guardian") {
          attacker.currentHP -= Math.ceil(damageTotal * 0.05);
        }
      }
    },
    //Sets a new target for the player
    setTarget(id) {
      this.playerTarget = this.combatEnemies.find(
        (enemy) => enemy.combatId === id
      );

      this.adjustArrowPosition(id);
    },
    adjustArrowPosition(id) {
      const sprite = useSpriteStore();
      const anim = animation();

      const index = id - 1;

      sprite.enemyArrow.position = new anim.Vector2(
        16 * 50 + (index % 2 ? 32 : 0),
        16 * 10 + index * (16 * 5)
      );
    },
    //Decides if user can flee. Starts at 25% chance, increase based on player health
    fleeCombat() {
      let fleeChance = 25;

      fleeChance += Math.max(
        75 -
          Math.round(((store.hero.currentHP / store.hero.maxHP) * 100) / 10) *
            10,
        0
      );

      let oil = store.hero.items.find((item) => item.name === "oil");

      if (oil) {
        fleeChance += oil.stack * 10;
      }

      const chance = getRandomNum(100);

      if (chance <= fleeChance) {
        return true;
      }
      return false;
    },
    //2nd actions, different per class
    secondAction(currentCharacter, target) {
      const store = useMainStore();
      const damage = damageFuncs();
      //Knight
      if (store.hero.secondAbility.name === "For Honor") {
        const damageVal = damage.calcDamage(currentCharacter, target, 1.25);
        this.attack(currentCharacter, target, damageVal);

        let defReduce = Math.ceil(target.defense * 0.2);
        if (defReduce < 1) {
          defReduce = 1;
        }

        target.defense -= defReduce;
      }
      //Thief
      else if (store.hero.secondAbility.name === "Dual Slash") {
        const firstAtkDamage = damage.calcDamage(
          currentCharacter,
          target,
          0.75
        );
        this.attack(currentCharacter, target, firstAtkDamage);

        const secondAtkDamage = damage.calcDamage(
          currentCharacter,
          target,
          0.75
        );
        this.attack(currentCharacter, target, secondAtkDamage);

        store.hero.speed += 2;
      }
      //Guardian
      else if (store.hero.secondAbility.name === "Barrier") {
        //TODO: Somehow this needs to reset after the next turn
        store.hero.defense += store.hero.defense;
      }
      //Berserker
      else if (store.hero.secondAbility.name === "Rage") {
        store.hero.currentHP -= Math.ceil(store.hero.maxHP * 0.2);
        store.hero.attack += Math.ceil(store.hero.attack * 1.2);
      }
      //Alchemist
      else if (store.hero.secondAbility.name === "Toxin") {
        let enemyList = turnQueue.filter((item) => !item.player);

        for (let i = 0; i < enemyList.length; i++) {
          let target = enemyList[i];
          const damageVal = damage.calcDamage(currentCharacter, target, 0.25);
          this.attack(currentCharacter, target, damageVal);
          damage.applyStatusEffect(currentCharacter, target, "poison", 3);
        }
      }
      //Professor
      else if (store.hero.secondAbility.name === "Advantage") {
        let enemyList = turnQueue.filter((item) => !item.player);

        for (let i = 0; i < enemyList.length; i++) {
          let target = enemyList[i];
          damage.applyStatusEffect(currentCharacter, target, "stun", 1);
        }
      }

      const energyDrink = store.hero.items.find(
        (item) => item.name === "energyDrink"
      );

      this.secondCooldown = store.hero.secondAbility.cooldown + 1;

      if (energyDrink) {
        this.secondCooldown -= energyDrink.stack;
      }

      if (this.secondCooldown < 0) {
        this.secondCooldown = 0;
      }

      const btn = document.getElementById("2ndActionButton");
      btn.disabled = true;
    },
    evadeAttack(target) {
      const store = useMainStore();
      const randomNum = store.getRandomNum(100);

      let evasionChance = target.evasion;

      if (target.player) {
        const shades = store.hero.items.find((item) => item.name === "shades");
        if (shades) {
          evasionChance += shades.stack * 5;
        }
      }

      if (randomNum <= evasionChance) {
        return true;
      }
      return false;
    },
    adjustEncounterVal() {
      const store = useMainStore();

      this.randomEncounter--;

      if (this.randomEncounter == 0) {
        this.randomEncounter =
          Math.floor(Math.random() * (250 - 100) + 100) + this.areaEncounterVal;

        this.encounterVal =
          this.encounterVal + store.hero.level + this.areaCombatVal;

        console.log("Starting combat at value " + this.encounterVal);
        this.combatInit(this.encounterVal);
      }
    },
  },
});
