import { useMainStore } from "../stores/mainStore";

export const keyInput = () => {
  const store = useMainStore();

  const left = "LEFT";
  const right = "RIGHT";
  const up = "UP";
  const down = "DOWN";

  //Main key event listener
  class Input {
    constructor() {
      this.directions = [];

      document.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowLeft":
          case "a":
            this.onKeyPress(left);
            break;
          case "ArrowRight":
          case "d":
            this.onKeyPress(right);
            break;
          case "ArrowUp":
          case "w":
            this.onKeyPress(up);
            break;
          case "ArrowDown":
          case "s":
            this.onKeyPress(down);
            break;
          default:
            return;
        }
      });

      document.addEventListener("keyup", (e) => {
        switch (e.key) {
          case "ArrowLeft":
          case "a":
            this.onKeyRelease(left);
            break;
          case "ArrowRight":
          case "d":
            this.onKeyRelease(right);
            break;
          case "ArrowUp":
          case "w":
            this.onKeyRelease(up);
            break;
          case "ArrowDown":
          case "s":
            this.onKeyRelease(down);
            break;
          default:
            return;
        }
      });
    }

    get direction() {
      return this.directions[0]; //returns the first direction
    }

    onKeyPress(direction) {
      if (!this.directions.includes(direction)) {
        this.directions.unshift(direction);
      }
    }

    onKeyRelease(direction) {
      const index = this.directions.indexOf(direction);
      if (this.directions.includes(direction)) {
        this.directions.splice(index, 1);
      }
    }
  }
  return {
    Input,
  };
};

export default keyInput;
