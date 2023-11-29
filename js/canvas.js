const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const mapSprite = new Sprite({
  resource: resources.images.map,
  frameSize: new Vector2(1280, 874),
});

const heroSprite = new Sprite({
  resource: resources.images.hero,
  frameSize: new Vector2(48, 48),
  hFrames: 3,
  vFrames: 4,
  frame: 1,
});

const heroPos = new Vector2(16 * 8, 16 * 2);

function draw() {
  mapSprite.drawImage(ctx, 0, 0);

  heroSprite.drawImage(ctx, heroPos.x, heroPos.y);
}

setInterval(() => {
  draw();
}, 1000);
