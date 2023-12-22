let heroSpritePath = ""

function startCanvas(){
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const mapSprite = new Sprite({
  resource: resources.images.map,
  frameSize: new Vector2(1280, 874),
});

const heroSprite = new Sprite({
  resource: heroSpritePath,
  frameSize: new Vector2(48, 48),
  hFrames: 3,
  vFrames: 4,
  frame: 1,
});

const heroAnims = {
  left: [3,4,5],
  right: [6,7,8],
  up: [9,10,11],
  down: [0,1,2],
  attack: []
}

const heroPos = new Vector2(16 * 12, 16 * 2);
const mapPos = new Vector2(0, 0)
//The center pos in the screen to determine if the maps needs to move
const centerScreenPos = new Vector2(16 * 16.5, 16 * 8.25)

const input = new Input()

let framePos = 0
let frameArr = []
let lastAnimUpdate = 0

function updateGraphics(){
  if(moveLock || inCombat){
    return
  }

  //Updates either the
  switch(input.direction){
    case "LEFT":
      frameArr = heroAnims["left"]
      framePos++
      adjustEncounterVal()
      
      if(heroPos.x - 80 < centerScreenPos.x && mapPos.x <= -2){
          mapPos.x+=2
      }else{
        if(heroPos.x > 2){
         heroPos.x -= 2}
      }
      break
    case "RIGHT":
      frameArr = heroAnims["right"]
      framePos++
      adjustEncounterVal()

      if(heroPos.x + 80 > centerScreenPos.x && mapPos.x > (mapSprite.frameSize.x - 528) * -1){
          mapPos.x-=2
      }else {
        
        if(heroPos.x < 528 - 2 - 48){
          heroPos.x += 2
        }
      }
      break
    case "UP":
      frameArr = heroAnims["up"]
      framePos++
      adjustEncounterVal()

      if(heroPos.y - 80 < centerScreenPos.y && mapPos.y <= -2 ){
          mapPos.y+=2
      }else{
        if(heroPos.y > 2){
          heroPos.y -= 2
        }
      }
      break
    case "DOWN":
      frameArr = heroAnims["down"]
      framePos++
      adjustEncounterVal()

      if(heroPos.y + 80 > centerScreenPos.y && mapPos.y > (mapSprite.frameSize.y - 264) * -1){
          mapPos.y-=2
      }else{
        if(heroPos.y < 264 - 2 - 48){
          heroPos.y += 2
        }
      }
      break
    case undefined:
      framePos = 1
      break
  }

  if(framePos > 2){
    framePos = 0
  }

  if(lastAnimUpdate >= 6){
    heroSprite.frame = frameArr[framePos]
    lastAnimUpdate = 0
  }
  else {
      lastAnimUpdate++
  }
}

function drawGraphics() {
  mapSprite.drawImage(ctx, mapPos.x, mapPos.y);

  heroSprite.drawImage(ctx, heroPos.x, heroPos.y);
}

const gameLoop = new GameLoop(updateGraphics, drawGraphics)
gameLoop.start()}