const mapContainer = document.getElementById("map-container");
const gameMap = document.getElementById("game-map");

let moveLock = true;

let offsetX = 0;
let offsetY = 0;

let randomEncounter = 20;
let areaEncounterVal = 1;
let encounterVal = 6;
let areaCombatVal = 0;

const heroSprites = [
  "./assets/characters/player_down.png",
  "./assets/characters/player_left.png",
  "./assets/characters/player_up.png",
  "./assets/characters/player_right.png",
];

document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
  const step = 5; // Adjust as needed

  if (moveLock || inCombat) {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      offsetX += step;
      changeSprite(heroSprites[1]);
      break;
    case "a":
      offsetX += step;
      changeSprite(heroSprites[1]);
      break;
    case "ArrowRight":
      offsetX -= step;
      changeSprite(heroSprites[3]);
      break;
    case "d":
      offsetX -= step;
      changeSprite(heroSprites[3]);
      break;
    case "ArrowUp":
      offsetY += step;
      changeSprite(heroSprites[2]);
      break;
    case "w":
      offsetY += step;
      changeSprite(heroSprites[2]);
      break;
    case "ArrowDown":
      offsetY -= step;
      changeSprite(heroSprites[0]);
      break;
    case "s":
      offsetY -= step;
      changeSprite(heroSprites[0]);
      break;
    default:
      return;
  }

  if (offsetX < -200) {
    offsetX = -200;
  } else if (offsetX > 200) {
    offsetX = 200;
  }
  if (offsetY < -200) {
    offsetY = -200;
  } else if (offsetY > 200) {
    offsetY = 200;
  }

  updateMapTransform();

  randomEncounter--;

  if (randomEncounter == 0) {
    randomEncounter = Math.floor(Math.random() * 40) + areaEncounterVal;

    encounterVal =
      encounterVal + player.level + areaCombatVal + enemiesDefeated;

    // const combatVal = Math.floor(Math.random() * (encounterVal - 5) + 5);

    console.log("Starting combat at value " + encounterVal);
    combatInit(encounterVal);
  }
}

function updateMapTransform() {
  gameMap.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

function changeSprite(sprite) {
  document.getElementById("player-character").src = sprite;
}
