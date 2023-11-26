const mapContainer = document.getElementById("map-container");
const gameMap = document.getElementById("game-map");

let moveLock = true;

let offsetX = 0;
let offsetY = 0;

let randomEncounter = 20;
let areaEncounterVal = 1;
let encounterVal = 6;
let areaCombatVal = 0;

document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
  const step = 5; // Adjust as needed

  if (moveLock) {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      offsetX += step;
      break;
    case "a":
      offsetX += step;
      break;
    case "ArrowRight":
      offsetX -= step;
      break;
    case "d":
      offsetX -= step;
      break;
    case "ArrowUp":
      offsetY += step;
      break;
    case "w":
      offsetY += step;
      break;
    case "ArrowDown":
      offsetY -= step;
      break;
    case "s":
      offsetY -= step;
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

    encounterVal = encounterVal + player.level + areaCombatVal;

    // const combatVal = Math.floor(Math.random() * (encounterVal - 5) + 5);

    console.log("Starting combat at value " + encounterVal);
    combatInit(encounterVal);
  }
}

function updateMapTransform() {
  gameMap.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}
