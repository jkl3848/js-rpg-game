import { defineStore } from "pinia";
import { useSpriteStore } from "./sprites";

import heroData from "../js/hero";
import healthFuncs from "../js/health";
import itemFuncs from "../js/items";

export const useMainStore = defineStore("mainStore", {
  state: () => {
    return {
      heroName: "",
      hero: {},
      blurbi: { level: 1, skills: [] },
      heroStats: { levelPoints: 4, nextXPLevel: 10, lastXPLevel: 0 },
      gameStats: { enemiesDefeated: 0 },
      elementStates: {
        startScreen: true,
        playerHud: false,
        gameCanvas: false,
        playerActions: false,
        gameOverScreen: false,
        playerStats: false,
        backpackOpen: false,
        levelUp: false,
      },
      itemChance: [50, 35, 12, 3],
      moveLock: false,
      gameMessage: "",
    };
  },
  actions: {
    startGame(classIndex) {
      const sprite = useSpriteStore();
      const hero = heroData();

      this.elementStates.startScreen = false;
      this.elementStates.gameCanvas = true;
      this.elementStates.playerHud = true;
      this.elementStates.playerActions = true;

      //Gets the canvas element
      const canvas = document.getElementById("game-canvas");
      sprite.ctx = canvas.getContext("2d");

      sprite.keyInput();
      hero.createHero(classIndex);
      sprite.startOverworldCanvas();
    },
    //Generates a random number between 1 and the input number
    getRandomNum(maxNum) {
      return Math.floor(Math.random() * maxNum) + 1;
    },
    //Gain xp for user
    gainXP(xp, loop) {
      let newXPGap;
      if (!loop) {
        this.gameMessage = "You gained " + xp + " XP!";
        if (this.hero.class === "professor") {
          xp += Math.ceil(xp * 0.1);
        }
        let textbook = this.hero.items.find((item) => item.name === "textbook");
        if (textbook) {
          xp += Math.floor((xp * (textbook.boost * textbook.stack)) / 100);
        }
        this.hero.xp += xp;
      }
      if (this.hero.xp >= this.heroStats.nextXPLevel) {
        this.levelUp();

        newXPGap = Math.floor((this.hero.level * 10 + this.hero.level) * 1.2);
        this.heroStats.lastXPLevel = this.heroStats.nextXPLevel;
        this.heroStats.nextXPLevel += newXPGap;

        //Loop until no more levels need to be gained
        this.gainXP(0, true);
      }
    },

    //Adds money for user
    gainMoney(money) {
      if (this.hero.class === "thief") {
        money += Math.floor(money * 0.15);
      }
      this.hero.money += money;
    },
    //If the hero has enough xp, level up
    levelUp() {
      const health = healthFuncs();
      const items = itemFuncs();

      this.moveLock = true;
      this.elementStates.levelUp = true;
      this.gameMessage = "You leveled up!";

      items.gainItem();

      this.heroStats.levelPoints = 4;
      this.hero.level++;
      this.hero.maxHP += 10;

      const oldStats = {
        maxHP: this.hero.maxHP,
        attack: this.hero.attack,
        defense: this.hero.defense,
        speed: this.hero.speed,
        critChance: this.hero.critChance,
      };

      //Opens level up ui for point allocation

      health.setHealthToMax(this.hero);
      this.gameMessage = "You are now level " + this.hero.level;
    },
  },
});
