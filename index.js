var player = {
  name: "Jake",
  player: true,
  combatId: 0,
  level: 1,
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
  let combatVal = 5;
  combatInit(combatVal);
}
