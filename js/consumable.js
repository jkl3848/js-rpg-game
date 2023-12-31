const consumables = [
  {
    name: "smallPotion",
    displayName: "Small Potion",
    type: "heal",
    attr: "currentHP",
    boost: 75,
    desc: "heal for 75",
  },
  {
    name: "largePotion",
    displayName: "Large Potion",
    type: "heal",
    attr: "currentHP",
    boost: 200,
    desc: "heal for 200",
  },
  {
    name: "gallonPotion",
    displayName: "Gallon Potion",
    type: "heal",
    attr: "currentHP",
    boost: 500,
    desc: "heal for 500",
  },
  {
    name: "adrenaline",
    displayName: "Adrenaline",
    type: "skill",
    attr: "",
    boost: 0,
    desc: "Resets 2nd ability cooldown",
  },
  {
    name: "gingerRoot",
    displayName: "Ginger Root",
    type: "effect",
    attr: "",
    boost: 0,
    desc: "removes POISON",
  },
  {
    name: "fireExtinguisher",
    displayName: "Fire Extinguisher",
    type: "effect",
    attr: "",
    boost: 0,
    desc: "removes BURN",
  },
  {
    name: "ductTape",
    displayName: "Duct Tape",
    type: "effect",
    attr: "",
    boost: 0,
    desc: "removes BROKEN",
  },
  {
    name: "fireCracker",
    displayName: "Fire Cracker",
    type: "effect",
    attr: "",
    boost: 0,
    desc: "applies 3 BURN",
  },
  {
    name: "rawChicken",
    displayName: "Raw Chicken",
    type: "effect",
    attr: "",
    boost: 0,
    desc: "applies 3 POISON",
  },
  {
    name: "bomb",
    displayName: "Bomb",
    type: "effect",
    attr: "",
    boost: 0,
    desc: "deals 10% MaxHP damage to all enemies",
  },
];

function gainConsumable(item) {
  if (!item) {
    const itemNumber = Math.floor(Math.random() * consumables.length);

    item = consumables[itemNumber];
  }
  if (player.backpack.find((obj) => obj.name === item.name)) {
    itemObj = player.backpack.find((obj) => obj.name === item.name);
    itemObj.stack++;
  }
  //otherwise add it
  else {
    itemObj = structuredClone(item);
    itemObj.stack = 1;
    player.backpack.push(itemObj);
  }

  addMessage("Gained " + item.name);

  updateBackpack();
}

function useConsumable(itemName) {
  const item = player.backpack.find((obj) => obj.name === itemName);

  const poison = player.effects.find((item) => item.type === "poison");
  const burn = player.effects.find((item) => item.type === "burn");
  const broken = player.effects.find((item) => item.type === "broken");

  if (!item) {
    return;
  }

  if (item.type === "heal") {
    if (player.currentHP < player.maxHP) {
      console.log("healing");
      player.currentHP += item.boost;
      balanceHealth();

      updatePlayerHealth();
    } else {
      return;
    }
  }else if(inCombat){
    if (item.name === "adrenaline") {
    secondCooldown = 0;
  } else if (item.name === "gingerRoot") {
    if(!poison){return}
    if (poison.stack > 1) {
      poison.stack--; 
    } else {
      player.effects = player.effects.filter((item) => item.type !== "poison");
    }
  } else if (item.name === "fireExtinguisher") {
    if(!burn){return}

    if (burn.stack > 1) {
      burn.stack--;
    } else {
      player.effects = player.effects.filter((item) => item.type !== "burn");
    }
  } else if (item.name === "ductTape") {
    if(!broken){return}

    if (broken.stack > 1) {
      broken.stack--;
    } else {
      player.effects = player.effects.filter((item) => item.type !== "broken");
    }
  }
  else if (item.name === "fireCracker") {
    applyStatusEffect(player, playerTarget, "burn", 3);
  }
  else if (item.name === "rawChicken") {
    applyStatusEffect(player, playerTarget, "poison", 3);
  }
  else if (item.name === "bomb") {
    let enemyList = turnQueue.filter((item) => !item.player);
    for (let i = 0; i < enemyList.length; i++) {
      let target = enemyList[i];

      target.currentHP -= Math.floor(target.maxHP * .1)
    }
  }}else{return}


  if (item.stack > 1) {
    item.stack--;
  } else {
    player.backpack = player.backpack.filter((obj) => obj.name !== item.name);
  }

  updateBackpack();
}

function updateBackpack() {
  for (let i = 0; i < consumables.length; i++) {
    const item = consumables[i];
    const itemSlot = document.getElementById(item.name);
    let stack = 0;
    const packItem = player.backpack.find((obj) => obj.name === item.name);

    if (packItem) {
      stack = packItem.stack;
    }

    itemSlot.innerHTML = `<span class='consum-stack'>${item.displayName}: ${stack}</span><span class='tooltip-text'>${item.desc}</span>`;
  }
}
