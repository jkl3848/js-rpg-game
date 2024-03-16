import { defineStore } from "pinia";
import { useMainStore } from "./mainStore";
import { useCombatStore } from "./combat";

import animation from "../js/animation";
import gameLoop from "../js/gameLoop";
import enemyData from "../js/enemies";

export const useSpriteStore = defineStore("sprites", {
  state: () => {
    return {
      hero: {
        spritePath: null,
        sprite: null,
        position: null,
        lastPosition: null,
        animations: [],
        frameIndex: 0,
        frameArr: [],
      },
      blurbi: {
        spritePath: null,
        sprite: null,
        position: null,
        lastPosition: null,
        frameIndex: 0,
      },
      map: {
        spritePath: null,
        sprite: null,
        position: null,
        lastPosition: null,
        centerScreen: null,
        lastCenter: null,
      },
      enemies: [],
      enemyArrow: {
        sprite: null,
        position: null,
        frameIndex: 0,
      },
      canvasState: {
        overworld: true,
        combat: false,
      },
      loop: null,
      animData: {
        lastUpdate: 0,
      },
      ctx: null,
      keyDirection: [],
    };
  },
  actions: {
    startOverworldCanvas() {
      const anim = animation();

      this.map.spritePath = anim.resources.images.overworldMap1;
      this.blurbi.spritePath = anim.resources.images.blurbi;

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

      this.blurbi.sprite = new anim.Sprite({
        resource: this.blurbi.spritePath,
        frameSize: new anim.Vector2(48, 48),
        hFrames: 4,
        vFrames: 1,
        frame: 0,
      });

      if (this.hero.lastPosition) {
        this.hero.position = this.hero.lastPosition;
      } else {
        this.hero.position = new anim.Vector2(16 * 12, 16 * 3);
      }
      if (this.blurbi.lastPosition) {
        this.blurbi.position = this.blurbi.lastPosition;
      } else {
        this.blurbi.position = new anim.Vector2(16 * 14, 16 * 2);
      }

      if (this.map.lastPosition) {
        this.map.position = this.map.lastPosition;
      } else {
        this.map.position = new anim.Vector2(0, 0);
      }
      //The center pos in the screen to determine if the maps needs to move
      if (this.map.lastCenter) {
        this.map.centerScreen = this.map.lastCenter;
      } else {
        this.map.centerScreen = new anim.Vector2(16 * 16, 16 * 8);
      }

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
    updateOverworldGraphics() {
      const store = useMainStore();
      const combat = useCombatStore();

      if (store.moveLock || combat.inCombat) {
        return;
      }

      //Updates either the
      switch (this.keyDirection[0]) {
        case "LEFT":
          this.hero.frameArr = this.hero.animations["left"];
          this.hero.frameIndex++;
          combat.adjustEncounterVal();

          if (
            this.hero.position.x - 80 < this.map.centerScreen.x &&
            this.map.position.x <= -2
          ) {
            this.map.position.x += 2;
          } else {
            if (this.hero.position.x > 2) {
              this.hero.position.x -= 2;
              this.blurbi.position.x -= 2;
            }
          }
          break;
        case "RIGHT":
          this.hero.frameArr = this.hero.animations["right"];
          this.hero.frameIndex++;
          combat.adjustEncounterVal();

          if (
            this.hero.position.x + 80 > this.map.centerScreen.x &&
            this.map.position.x > (this.map.sprite.frameSize.x - 1024) * -1
          ) {
            this.map.position.x -= 2;
          } else {
            if (this.hero.position.x < 1024 - 2 - 48) {
              this.hero.position.x += 2;
              this.blurbi.position.x += 2;
            }
          }
          break;
        case "UP":
          this.hero.frameArr = this.hero.animations["up"];
          this.hero.frameIndex++;
          combat.adjustEncounterVal();

          if (
            this.hero.position.y - 80 < this.map.centerScreen.y &&
            this.map.position.y <= -2
          ) {
            this.map.position.y += 2;
          } else {
            if (this.hero.position.y > 2) {
              this.hero.position.y -= 2;
              this.blurbi.position.y -= 2;
            }
          }
          break;
        case "DOWN":
          this.hero.frameArr = this.hero.animations["down"];
          this.hero.frameIndex++;
          combat.adjustEncounterVal();

          if (
            this.hero.position.y + 80 > this.map.centerScreen.y &&
            this.map.position.y > (this.map.sprite.frameSize.y - 512) * -1
          ) {
            this.map.position.y -= 2;
          } else {
            if (this.hero.position.y < 512 - 2 - 48) {
              this.hero.position.y += 2;
              this.blurbi.position.y += 2;
            }
          }
          break;
        case undefined:
          this.hero.frameIndex = 1;
          break;
      }

      if (this.hero.frameIndex > 2) {
        this.hero.frameIndex = 0;
      }

      if (this.animData.lastUpdate >= 6) {
        this.hero.sprite.frame = this.hero.frameArr[this.hero.frameIndex];
        this.blurbi.sprite.frame = this.blurbi.frameIndex;

        if (this.blurbi.frameIndex > 3) {
          this.blurbi.frameIndex = 0;
        } else {
          this.blurbi.frameIndex++;
        }

        this.animData.lastUpdate = 0;
      } else {
        this.animData.lastUpdate++;
      }
    },
    startCombatCanvas() {
      const anim = animation();
      const combat = useCombatStore();
      const enData = enemyData();

      this.enemies = [];

      this.map.spritePath = anim.resources.images.combatMap1;

      this.map.sprite = new anim.Sprite({
        resource: this.map.spritePath,
        frameSize: new anim.Vector2(1104, 621),
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

      this.enemyArrow.sprite = new anim.Sprite({
        resource: anim.resources.images.iconArrowDown,
        frameSize: new anim.Vector2(48, 48),
        hFrames: 1,
        vFrames: 1,
        frame: 0,
      });

      console.log(combat.combatEnemies);

      for (let i = 0; i < combat.combatEnemies.length; i++) {
        console.log("Generating enemy " + i);
        const enemyEl = combat.combatEnemies[i];
        let tempEn = {};

        tempEn.sprite = new anim.Sprite({
          resource: enData.mobRsrc.find((item) => item.name === enemyEl.name)
            .imgResource,
          frameSize: new anim.Vector2(48, 48),
          hFrames: 3,
          vFrames: 1,
          frame: 0,
        });

        tempEn.position = new anim.Vector2(
          16 * 50 + (i % 2 ? 32 : 0),
          16 * 14 + i * (16 * 5)
        );

        tempEn.combatId = enemyEl.combatId;

        console.log(tempEn);

        this.enemies.push(tempEn);
      }

      console.log(this.enemies);

      this.hero.lastPosition = this.hero.position;
      this.hero.position = new anim.Vector2(16 * 8, 16 * 14);
      this.blurbi.lastPosition = this.blurbi.position;
      this.blurbi.position = new anim.Vector2(16 * 6, 16 * 10);

      this.map.lastPosition = this.map.position;
      this.map.position = new anim.Vector2(0, 0);
      //The center pos in the screen to determine if the maps needs to move
      this.map.lastCenter = this.map.centerScreen;
      this.map.centerScreen = new anim.Vector2(16 * 16, 16 * 8);

      this.hero.frameArr = this.hero.animations["right"];

      this.startCombatLoop();
    },
    startCombatLoop() {
      const gl = gameLoop();
      this.loop = new gl.GameLoop(this.updateCombatGraphics, this.drawGraphics);
      this.loop.start();
    },
    stopCombatLoop() {
      this.loop.stop();
    },
    updateCombatGraphics() {
      if (this.animData.lastUpdate >= 24) {
        if (this.hero.frameIndex >= 1) {
          this.hero.frameIndex = 0;
        } else {
          this.hero.frameIndex = 1;
        }

        if (this.blurbi.frameIndex > 3) {
          this.blurbi.frameIndex = 0;
        } else {
          this.blurbi.frameIndex++;
        }

        this.blurbi.sprite.frame = this.blurbi.frameIndex;
        this.hero.sprite.frame = this.hero.frameArr[this.hero.frameIndex];

        for (let i = 0; i < this.enemies.length; i++) {
          this.enemies[i].sprite.frame = this.hero.frameIndex;
        }

        this.animData.lastUpdate = 0;
      } else {
        this.animData.lastUpdate++;
      }
    },
    drawGraphics() {
      const combat = useCombatStore();

      const scale = combat.inCombat ? 2 : 1;

      this.map.sprite.drawImage(
        this.ctx,
        this.map.position.x,
        this.map.position.y,
        1
      );

      this.hero.sprite.drawImage(
        this.ctx,
        this.hero.position.x,
        this.hero.position.y,
        scale
      );

      this.blurbi.sprite.drawImage(
        this.ctx,
        this.blurbi.position.x,
        this.blurbi.position.y,
        scale
      );

      if (combat.inCombat) {
        for (let i = 0; i < this.enemies.length; i++) {
          this.enemies[i].sprite.drawImage(
            this.ctx,
            this.enemies[i].position.x,
            this.enemies[i].position.y,
            scale
          );
        }
        this.enemyArrow.sprite.drawImage(
          this.ctx,
          this.enemyArrow.position.x,
          this.enemyArrow.position.y,
          scale
        );
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
