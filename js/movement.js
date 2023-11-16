const mapContainer = document.getElementById("map-container");
const gameMap = document.getElementById("game-map");

let offsetX = 0;
let offsetY = 0;

let randomEncounter = 20;
let encounterVal = 5;

document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
  const step = 5; // Adjust as needed

  switch (event.key) {
    case "ArrowLeft":
      offsetX += step;
      break;
    case "ArrowRight":
      offsetX -= step;
      break;
    case "ArrowUp":
      offsetY += step;
      break;
    case "ArrowDown":
      offsetY -= step;
      break;
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
    randomEncounter = 20;

    const combatVal = Math.floor(Math.random() * (encounterVal - 5) + 5);

    console.log("Starting combat at value " + combatVal);
    combatInit(combatVal);
  }
}

function updateMapTransform() {
  gameMap.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}
