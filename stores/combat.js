import { defineStore } from "pinia";
import { useMainStore } from "./mainStore";
import { useSpriteStore } from "./sprites";

let thiefStartSpeed;
let guardianStartDefense;
let berserkerStartAttack;

let playerTarget;

export const useCombatStore = defineStore("combat", {
  state: () => {
    return {
      combatVal: 0,
      inCombat: false,
      turnQueue: [],
      enemies: [],
      secondCooldown: 0,
      randomEncounter: 200,
      areaEncounterVal: 1,
      encounterVal: 6,
      areaCombatVal: 0,
    };
  },
  actions: {
    async combatInit() {
      const store = useMainStore();
      const sprite = useSpriteStore();

      this.inCombat = true;
      sprite.canvasState.overworld = false;
      sprite.canvasState.combat = true;

      this.enemies = generateEnemies(this.combatVal);
      const numberOfEnemies = this.enemies.length;

      if (store.hero.class === "thief") {
        thiefStartSpeed = store.hero.speed;
      } else if (store.hero.class === "guardian") {
        guardianStartDefense = store.hero.defense;
      } else if (store.hero.class === "berserker") {
        berserkerStartAttack = store.hero.attack;
      }

      const xpToGain = this.enemies.reduce(
        (sum, obj) => sum + obj.threatLevel,
        0
      );

      //Sort the initial combat queue by speed
      this.turnQueue = [store.hero].concat(this.enemies);
      this.turnQueue.sort((a, b) => b.speed - a.speed);

      console.log(this.turnQueue);

      //Generate enemies dom elements
      createCombatElements(this.enemies);

      //Sets the first enemy as the default target for the user
      setTarget(1);

      //Set turn counter equal to highest speed in group
      const maxTurnCount = this.turnQueue.reduce(
        (max, obj) => (obj.speed > max.speed ? obj : max),
        this.turnQueue[0]
      ).speed;

      //Set hero's turn counter to speed
      this.turnQueue[0].turnCounter = this.turnQueue[0].speed;

      //While the hero and at least 1 enemy has health
      while (
        store.hero.currentHP > 0 &&
        this.enemies.some((obj) => obj.currentHP > 0)
      ) {
        setVisibleTurnOrder();
        const currentCharacter = this.turnQueue.shift();
        let target = null;
        let action;

        this.turnQueue.push(currentCharacter);
        // Show the next two turns in the turn list
        // const nextTwoTurns = turnQueue.slice(0, 2);
        // addMessage(
        //   "Next two turns:",
        //   nextTwoTurns.map((char) => char.name)
        // );

        currentCharacter.turnCounter += currentCharacter.speed;

        const stunned = currentCharacter.effects?.find(
          (item) => item.type === "stun"
        );
        //If the turn counter reaches the max, take an action
        if (currentCharacter.turnCounter >= maxTurnCount && !stunned) {
          currentCharacter.turnCounter -= maxTurnCount;
          addMessage(`Turn: ${currentCharacter.name}`);

          //First resolve any effects on the acting char
          //TODO: Need to bail if the effects kill the char
          resolveStatusEffects(currentCharacter);

          if (currentCharacter.player) {
            //2nd action cooldown
            if (secondCooldown > 0) {
              secondCooldown--;
              if (secondCooldown == 0) {
                const btn = document.getElementById("2ndActionButton");
                btn.disabled = false;
              }
            }
            //Wait for the user to pick an action before continuing
            action = await waitForUserAttack();
            target = playerTarget;
          } else {
            target = store.hero;
          }

          //Reset guardian defense for 2nd ability
          if (store.hero.class === "guardian") {
            resetStats();
          }

          //Different action types
          if (action === "attack" || !currentCharacter.player) {
            attack(currentCharacter, target);
          } else if (action === "second") {
            secondAction(currentCharacter, target);
          } else if (action === "flee") {
            const flee = fleeCombat();

            if (flee) {
              addMessage("You successfully fled");
              const container = document.getElementById("characters");
              container.innerHTML = "";

              resetStats(true);
              clearCombatOverlay();
              return;
            }

            addMessage("You failed to flee");
          }

          //Updates all chars health in ui
          updateHealth(this.turnQueue);

          if (target.currentHP === 0 && !target.player) {
            //If multiple enemies, remove defeated enemy
            if (this.enemies.length > 1) {
              defeatedEnemy(target);
            }

            if (store.hero.class === "berserker") {
              store.hero.currentHP += Math.ceil(store.hero.maxHP * 0.05);
              balanceHealth();
              updatePlayerHealth();
            }
          }

          //Update hud to reflect any status changes
          updatePlayerHUD();
        } else if (stunned) {
          currentCharacter.turnCounter -= maxTurnCount;
          resolveStatusEffects(currentCharacter);
        }
      }

      resetStats(true);

      const container = document.getElementById("characters");
      container.innerHTML = "";

      this.inCombat = false;
      this.turnQueue = [];
      this.enemies = [];

      if (store.hero.currentHP > 0) {
        addMessage("You Win!");
        postCombat(xpToGain, numberOfEnemies);
      } else {
        gameOver();
      }
    },
    defeatedEnemy(enemy) {
      const store = useMainStore();
      store.enemiesDefeated++;
      addMessage(`${enemy.name} defeated!`);
      this.turnQueue = this.turnQueue.filter(
        (char) => char.combatId !== enemy.combatId
      );
      this.enemies = this.enemies.filter(
        (char) => char.combatId !== enemy.combatId
      );

      //Regenerate enemies dom elements
      createCombatElements(this.enemies);

      //Sets the first enemy as the default target for the user
      setTarget(this.enemies[0].combatId);
    },
    resetStats(end) {
      const store = useMainStore();
      if (end) {
        store.hero.turnCounter = 0;
      }

      if (store.hero.class === "thief") {
        store.hero.speed = thiefStartSpeed;
      } else if (player.class === "guardian") {
        store.hero.defense = guardianStartDefense;
      } else if (player.class === "berserker") {
        store.hero.attack = berserkerStartAttack;
      }
    },
    //Attacks a target
    attack(attacker, target, damage) {
      if (evadeAttack(target)) {
        return;
      }

      if (!damage) {
        damage = calcDamage(attacker, target);
      }

      target.currentHP = target.currentHP - damage;
      if (target.currentHP < 0) {
        target.currentHP = 0;
      }

      addMessage(target.name + " took " + damage + " damage");
      console.log(target.name + " took " + damage + " damage");

      applyStatusEffect(attacker, target);

      if (target.player) {
        let coin = target.items.find((item) => item.name === "rareCoin");

        if (coin) {
          player.money += Math.ceil(damage * (coin.stack / 100));
        }

        if (player.class === "guardian") {
          attacker.currentHP -= Math.ceil(damage * 0.05);
        }
      }

      // if (attacker.player) {
      //   const atkBtn = document.getElementById("attackButton");
      //   atkBtn.disabled = true;
      // }
    },
    //Sets a new target for the player
    setTarget(id) {
      //Reset target selection and color
      const targetEl = document.querySelectorAll(".target-enemy");

      targetEl.forEach((el) => {
        el.classList.remove("target-enemy");
      });

      playerTarget = enemies.find((enemy) => enemy.combatId === id);

      const target = document.getElementById("char-" + id);
      target.classList.add("target-enemy");

      const turnEls = document.querySelectorAll(`#turn-char-${id}`);

      turnEls.forEach((el) => {
        el.classList.add("target-enemy");
      });
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

      const chance = random100();

      if (chance <= fleeChance) {
        return true;
      }
      return false;
    },
    //2nd actions, different per class
    secondAction(currentCharacter, target) {
      const store = useMainStore();
      //Knight
      if (store.hero.secondAbility.name === "For Honor") {
        const damage = calcDamage(currentCharacter, target, 1.25);
        this.attack(currentCharacter, target, damage);

        let defReduce = Math.ceil(target.defense * 0.2);
        if (defReduce < 1) {
          defReduce = 1;
        }

        target.defense -= defReduce;
      }
      //Thief
      else if (store.hero.secondAbility.name === "Dual Slash") {
        const firstAtkDamage = calcDamage(currentCharacter, target, 0.75);
        this.attack(currentCharacter, target, firstAtkDamage);

        const secondAtkDamage = calcDamage(currentCharacter, target, 0.75);
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

        updatePlayerHealth();
      }
      //Alchemist
      else if (store.hero.secondAbility.name === "Toxin") {
        let enemyList = turnQueue.filter((item) => !item.player);

        for (let i = 0; i < enemyList.length; i++) {
          let target = enemyList[i];
          const damage = calcDamage(currentCharacter, target, 0.25);
          this.attack(currentCharacter, target, damage);
          applyStatusEffect(currentCharacter, target, "poison", 3);
        }
      }
      //Professor
      else if (store.hero.secondAbility.name === "Advantage") {
        let enemyList = turnQueue.filter((item) => !item.player);

        for (let i = 0; i < enemyList.length; i++) {
          let target = enemyList[i];
          applyStatusEffect(currentCharacter, target, "stun", 1);
        }
      }

      const energyDrink = store.hero.items.find(
        (item) => item.name === "energyDrink"
      );

      secondCooldown = store.hero.secondAbility.cooldown + 1;

      if (energyDrink) {
        secondCooldown -= energyDrink.stack;
      }

      if (secondCooldown < 0) {
        secondCooldown = 0;
      }

      const btn = document.getElementById("2ndActionButton");
      btn.disabled = true;
    },
    evadeAttack(target) {
      const store = useMainStore();
      const randomNum = store.random100();

      let evasionChance = target.evasion;

      if (target.player) {
        const shades = player.items.find((item) => item.name === "shades");
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

        // const combatVal = Math.floor(Math.random() * (encounterVal - 5) + 5);

        console.log("Starting combat at value " + this.encounterVal);
        this.combatInit(this.encounterVal);
      }
    },
  },
});