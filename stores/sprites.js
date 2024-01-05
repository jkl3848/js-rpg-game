import { defineStore } from "pinia";
import { useMainStore } from "./mainStore";
import { useCombatStore } from "./combat";

import animation from "../js/animation";
import keyInput from "../js/input";
import gameLoop from "../js/gameLoop";

export const useSpriteStore = defineStore("sprites", {
  state: () => {
    return {
      heroSpritePath: "",
      mapSpritePath: "",
      canvasState: {
        overworld: true,
        combat: false,
      },
    };
  },
  actions: {
    startCanvas() {
      const store = useMainStore();
      const combat = useCombatStore();

      const anim = animation();
      const key = keyInput();
      const gl = gameLoop();

      const canvas = document.getElementById("game-canvas");
      const ctx = canvas.getContext("2d");

      const mapSprite = new anim.Sprite({
        resource: anim.resources.images.map,
        frameSize: new anim.Vector2(1280, 874),
      });

      const heroSprite = new anim.Sprite({
        resource: this.heroSpritePath,
        frameSize: new anim.Vector2(48, 48),
        hFrames: 3,
        vFrames: 4,
        frame: 1,
      });

      const heroAnims = {
        left: [3, 4, 5],
        right: [6, 7, 8],
        up: [9, 10, 11],
        down: [0, 1, 2],
        attack: [],
      };

      const heroPos = new anim.Vector2(16 * 12, 16 * 2);
      const mapPos = new anim.Vector2(0, 0);
      //The center pos in the screen to determine if the maps needs to move
      const centerScreenPos = new anim.Vector2(16 * 16, 16 * 8);

      const input = new key.Input();

      let framePos = 0;
      let frameArr = [];
      let lastAnimUpdate = 0;

      function updateGraphics() {
        if (store.moveLock || combat.inCombat) {
          return;
        }

        //Updates either the
        switch (input.direction) {
          case "LEFT":
            frameArr = heroAnims["left"];
            framePos++;
            combat.adjustEncounterVal();

            if (heroPos.x - 80 < centerScreenPos.x && mapPos.x <= -2) {
              mapPos.x += 2;
            } else {
              if (heroPos.x > 2) {
                heroPos.x -= 2;
              }
            }
            break;
          case "RIGHT":
            frameArr = heroAnims["right"];
            framePos++;
            combat.adjustEncounterVal();

            if (
              heroPos.x + 80 > centerScreenPos.x &&
              mapPos.x > (mapSprite.frameSize.x - 512) * -1
            ) {
              mapPos.x -= 2;
            } else {
              if (heroPos.x < 512 - 2 - 48) {
                heroPos.x += 2;
              }
            }
            break;
          case "UP":
            frameArr = heroAnims["up"];
            framePos++;
            combat.adjustEncounterVal();

            if (heroPos.y - 80 < centerScreenPos.y && mapPos.y <= -2) {
              mapPos.y += 2;
            } else {
              if (heroPos.y > 2) {
                heroPos.y -= 2;
              }
            }
            break;
          case "DOWN":
            frameArr = heroAnims["down"];
            framePos++;
            combat.adjustEncounterVal();

            if (
              heroPos.y + 80 > centerScreenPos.y &&
              mapPos.y > (mapSprite.frameSize.y - 256) * -1
            ) {
              mapPos.y -= 2;
            } else {
              if (heroPos.y < 256 - 2 - 48) {
                heroPos.y += 2;
              }
            }
            break;
          case undefined:
            framePos = 1;
            break;
        }

        if (framePos > 2) {
          framePos = 0;
        }

        if (lastAnimUpdate >= 6) {
          heroSprite.frame = frameArr[framePos];
          lastAnimUpdate = 0;
        } else {
          lastAnimUpdate++;
        }
      }

      function drawGraphics() {
        mapSprite.drawImage(ctx, mapPos.x, mapPos.y);

        heroSprite.drawImage(ctx, heroPos.x, heroPos.y);
      }

      const loop = new gl.GameLoop(updateGraphics, drawGraphics);
      loop.start();
    },
  },
});
