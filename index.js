var player = {
  name: "Jake",
  player: true,
  combatId: 0,
  level: 1,
  xp: 0,
  currentHP: 100,
  maxHP: 100,
  attack: 10,
  defense: 10,
  speed: 10,
  critChance: 1,
  evasion: 0,
  items: [],
  scale: [15, 1, 1, 1, 0],
  effects: [],
};

function start() {
  updatePlayerHUD();
  // combatInit(12);
}

function postCombat(xp) {
  gainXP(xp);

  updatePlayerHUD();
}

function gainXP(xp) {
  addMessage("You gained " + xp + " XP!");
  player.xp += xp;

  if (player.xp >= player.level * 10) {
    levelUp();
  }
}

function levelUp() {
  addMessage("You leveled up!");
  const statScale = player.scale;

  player.level++;
  player.maxHP += statScale[0];
  player.attack += statScale[1];
  player.defense += statScale[2];
  player.speed += statScale[3];
  player.critChance += statScale[4];

  player.currentHP = player.maxHP;
  addMessage("You are now level " + player.level);
}

function updatePlayerHUD() {
  const playerHP = document.getElementById("player-hp");
  playerHP.innerHTML = `${player.currentHP} / ${player.maxHP} HP`;

  const playerXP = document.getElementById("player-xp");
  playerXP.innerHTML = `${player.xp} / ${player.level * 10} XP`;

  const playerItems = document.getElementById("player-items");
  playerItems.innerHTML = `${player.items}`;

  const playerStats = document.getElementById("player-stats");
  playerStats.innerHTML = `ATK: ${player.attack} DEF: ${player.defense} SPD: ${player.speed} CRT: ${player.critChance}%`;
}

function gainItem() {}
