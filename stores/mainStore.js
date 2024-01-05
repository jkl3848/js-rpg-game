import { defineStore } from "pinia";
import { useSpriteStore } from "./sprites";

import heroData from "../js/hero";

export const useMainStore = defineStore("mainStore", {
  state: () => {
    return {
      heroName: "",
      hero: {},
      heroStats: { levelPoints: 4, nextXPLevel: 10, lastXPLevel: 0 },
      gameStats: { enemiesDefeated: 0 },
      elementStates: {
        startScreen: true,
        playerHud: false,
        gameCanvas: false,
        playerActions: false,
        GameOverScreen: false,
      },
      itemChance: [50, 35, 12, 3],
      moveLock: false,
    };
  },
  actions: {
    startGame(classIndex) {
      const sprite = useSpriteStore();
      const hero = heroData();

      this.elementStates.startScreen = false;
      this.elementStates.gameCanvas = true;

      hero.createHero(classIndex);
      sprite.startCanvas();
    },
    //Generates a random number between 1 and 100
    random100() {
      return Math.floor(Math.random() * 100) + 1;
    },
  },
});