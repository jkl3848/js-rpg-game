import { defineStore } from "pinia";
import { useMainStore } from "./mainStore";
import { useCombatStore } from "./combat";

import animation from "../js/animation";
import gameLoop from "../js/gameLoop";

export const useSpriteStore = defineStore("sprites", {
  state: () => {
    return {
      hero: {
        spritePath: null,
        sprite: null,
        position: null,
        animations: [],
      },
      map: {
        spritePath: null,
        sprite: null,
        position: null,
        centerScreen: null,
      },
      canvasState: {
        overworld: true,
        combat: false,
      },
      loop: null,
      animData: {
        framePosition: 0,
        frameArr: [],
        lastUpdate: 0,
      },
      ctx: null,
      keyDirection: [],
    };
  },
  actions: {
    startOverworldCanvas() {
      const anim = animation();

      const canvas = document.getElementById("game-canvas");
      this.ctx = canvas.getContext("2d");

      this.map.spritePath = anim.resources.images.overworldMap1;

      this.map.sprite = new anim.Sprite({
        resource: this.map.spritePath,
        frameSize: new anim.Vector2(1280, 874),
      });

      this.hero.sprite = new anim.Sprite({
        resource: this.hero.spritePath,
        frameSize: new anim.Vector2(48, 48),
        hFrames: 3,
        vFrames: 4,
        frame: 1,
      });

      this.hero.animations = {
        left: [3, 4, 5],
        right: [6, 7, 8],
        up: [9, 10, 11],
        down: [0, 1, 2],
        attack: [],
      };

      this.hero.position = new anim.Vector2(16 * 12, 16 * 2);
      this.map.position = new anim.Vector2(0, 0);
      //The center pos in the screen to determine if the maps needs to move
      this.map.centerScreen = new anim.Vector2(16 * 16, 16 * 8);

      this.startOverworldLoop();
    },
    startOverworldLoop() {
      const gl = gameLoop();
      this.loop = new gl.GameLoop(
        this.updateOverworldGraphics,
        this.drawGraphics
      );
      this.loop.start();
    },
    stopOverworldLoop() {
      this.loop.stop();
    },
    drawGraphics() {
      this.map.sprite.drawImage(
        this.ctx,
        this.map.position.x,
        this.map.position.y
      );

      this.hero.sprite.drawImage(
        this.ctx,
        this.hero.position.x,
        this.hero.position.y
      );
    },
    updateOverworldGraphics() {
      const store = useMainStore();
      const combat = useCombatStore();

      if (store.moveLock || combat.inCombat) {
        return;
      }

      console.log(this.keyDirection[0]);

      //Updates either the
      switch (this.keyDirection[0]) {
        case "LEFT":
          this.animData.frameArr = this.hero.animations["left"];
          this.animData.framePosition++;
          combat.adjustEncounterVal();

          if (
            this.hero.position.x - 80 < this.map.centerScreen.x &&
            this.map.position.x <= -2
          ) {
            this.map.position.x += 2;
          } else {
            if (this.hero.position.x > 2) {
              this.hero.position.x -= 2;
            }
          }
          break;
        case "RIGHT":
          this.animData.frameArr = this.hero.animations["right"];
          this.animData.framePosition++;
          combat.adjustEncounterVal();

          if (
            this.hero.position.x + 80 > this.map.centerScreen.x &&
            this.map.position.x > (this.map.sprite.frameSize.x - 512) * -1
          ) {
            this.map.position.x -= 2;
          } else {
            if (this.hero.position.x < 512 - 2 - 48) {
              this.hero.position.x += 2;
            }
          }
          break;
        case "UP":
          this.animData.frameArr = this.hero.animations["up"];
          this.animData.framePosition++;
          combat.adjustEncounterVal();

          if (
            this.hero.position.y - 80 < this.map.centerScreen.y &&
            this.map.position.y <= -2
          ) {
            this.map.position.y += 2;
          } else {
            if (this.hero.position.y > 2) {
              this.hero.position.y -= 2;
            }
          }
          break;
        case "DOWN":
          this.animData.frameArr = this.hero.animations["down"];
          this.animData.framePosition++;
          combat.adjustEncounterVal();

          if (
            this.hero.position.y + 80 > this.map.centerScreen.y &&
            this.map.position.y > (this.map.sprite.frameSize.y - 256) * -1
          ) {
            this.map.position.y -= 2;
          } else {
            if (this.hero.position.y < 256 - 2 - 48) {
              this.hero.position.y += 2;
            }
          }
          break;
        case undefined:
          this.animData.framePosition = 1;
          break;
      }

      if (this.animData.framePosition > 2) {
        this.animData.framePosition = 0;
      }

      if (this.animData.lastUpdate >= 6) {
        this.hero.sprite.frame =
          this.animData.frameArr[this.animData.framePosition];
        this.animData.lastUpdate = 0;
      } else {
        this.animData.lastUpdate++;
      }
    },
    keyInput() {
      const left = "LEFT";
      const right = "RIGHT";
      const up = "UP";
      const down = "DOWN";

      let tempArr = [];

      document.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowLeft":
          case "a":
            onKeyPress(left);
            break;
          case "ArrowRight":
          case "d":
            onKeyPress(right);
            break;
          case "ArrowUp":
          case "w":
            onKeyPress(up);
            break;
          case "ArrowDown":
          case "s":
            onKeyPress(down);
            break;
          default:
            return;
        }
        this.keyDirection = tempArr;
      });

      document.addEventListener("keyup", (e) => {
        switch (e.key) {
          case "ArrowLeft":
          case "a":
            onKeyRelease(left);
            break;
          case "ArrowRight":
          case "d":
            onKeyRelease(right);
            break;
          case "ArrowUp":
          case "w":
            onKeyRelease(up);
            break;
          case "ArrowDown":
          case "s":
            onKeyRelease(down);
            break;
          default:
            return;
        }

        this.keyDirection = tempArr;
      });

      function onKeyPress(direction) {
        if (!tempArr.includes(direction)) {
          tempArr.unshift(direction);
        }
      }

      function onKeyRelease(direction) {
        const index = tempArr.indexOf(direction);
        if (tempArr.includes(direction)) {
          tempArr.splice(index, 1);
        }
      }
    },
  },
});
