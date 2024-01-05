import { useMainStore } from "../stores/mainStore";

export const animation = () => {
  const store = useMainStore();

  class Resources {
    constructor() {
      //Downloads images for use
      this.toLoad = {
        map: "assets/maps/test_map.jpg",
        hero: "assets/characters/hero-walking/knight.png",
      };

      //Holds all images
      this.images = {};

      //Loads images
      Object.keys(this.toLoad).forEach((key) => {
        const img = new Image();
        img.src = this.toLoad[key];
        this.images[key] = {
          image: img,
          isLoaded: false,
        };
        img.onload = () => {
          this.images[key].isLoaded = true;
        };
      });
    }
  }

  const resources = new Resources();

  class Sprite {
    constructor({
      resource, //image
      frameSize, //image crop
      hFrames, //horizontal sheet size
      vFrames, //vertical sheet size
      frame, //which frame we want
      scale,
      position,
    }) {
      this.resource = resource;
      this.frameSize = frameSize ?? new Vector2(16, 16);
      this.hFrames = hFrames ?? 1;
      this.vFrames = vFrames ?? 1;
      this.frame = frame ?? 0;
      this.frameMap = new Map();
      this.scale = scale ?? 1;
      this.position = position ?? new Vector2(0, 0);
      this.buildFrameMap();
    }

    buildFrameMap() {
      let frameCount = 0;

      //loops over each frame in sheet
      for (let i = 0; i < this.vFrames; i++) {
        for (let j = 0; j < this.hFrames; j++) {
          this.frameMap.set(
            frameCount,
            new Vector2(this.frameSize.x * j, this.frameSize.y * i)
          );
          frameCount++;
        }
      }
    }

    drawImage(ctx, x, y) {
      if (!this.resource.isLoaded) {
        return;
      }

      let frameCoordX = 0;
      let frameCoordY = 0;
      const frame = this.frameMap.get(this.frame);
      if (frame) {
        frameCoordX = frame.x;
        frameCoordY = frame.y;
      }

      const frameSizeX = this.frameSize.x;
      const frameSizeY = this.frameSize.y;

      ctx.drawImage(
        this.resource.image,
        frameCoordX,
        frameCoordY,
        frameSizeX,
        frameSizeY,
        x, //Actual map position
        y,
        frameSizeX * this.scale,
        frameSizeY * this.scale
      );
    }
  }

  class Vector2 {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  }

  return {
    Sprite,
    Vector2,
    resources,
  };
};

export default animation;