const gameVersion = "0.4.0";

function clearDataForNewGame() {
  encounterVal = 6;
  heroIndex = 0;
  levelPoints = 4;
  nextXPLevel = 10;
  lastXPLevel = 0;
  secondCooldown = 0;

  document.getElementById("current-xp").style.width = `0%`;
}

function gameOver() {
  clearDataForNewGame();
  clearMessage();
  clearAllOverlays();
  clearCombatOverlay();
  store.gameMessage = "You Lose!";
  document.getElementById("startButton").disabled = false;
  moveLock = true;

  document.getElementById("game-over").style.display = "flex";
}

//Functions to run after winning combat
function postCombat(xp, numberOfEnemies) {
  clearMessage();
  enemiesDefeated++;
  clearAllOverlays();
  clearCombatOverlay();

  postCombatHeal();
  gainXP(xp);

  for (let i = 0; i < numberOfEnemies; i++) {
    if (getRandomNum() <= 10) {
      gainConsumable();
    }
  }

  let coin = xp;
  const check = player.items.find((item) => item.name === "blankCheck");
  if (check) {
    coin += coin * (check.stack * 0.1);
  }

  gainMoney(Math.floor(coin));

  updatePlayerHUD();
}
