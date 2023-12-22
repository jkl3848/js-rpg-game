const mapContainer = document.getElementById("map-container");
const gameMap = document.getElementById("game-map");

let moveLock = true;

let offsetX = 0;
let offsetY = 0;

let randomEncounter = 200;
let areaEncounterVal = 1;
let encounterVal = 6;
let areaCombatVal = 0;

function adjustEncounterVal(){

  randomEncounter--;

  if (randomEncounter == 0) {
    randomEncounter = Math.floor(Math.random() * (250 - 100) + 100) + areaEncounterVal;

    encounterVal =
      encounterVal + player.level + areaCombatVal;

    // const combatVal = Math.floor(Math.random() * (encounterVal - 5) + 5);

    console.log("Starting combat at value " + encounterVal);
    combatInit(encounterVal);
  }
}
