const commonItems = [
  {
    name: "brokenWatch",
    displayName: "Broken Watch",
    boost: 5,
    stackBoost: 5,
    boostType: "add",
    target: "attr",
    attr: "critChance",
    desc: "Its right twice a day",
    detailedDesc: "Adds a 5% (+5% per stack) critical chance",
  },
  {
    name: "barbedBat",
    displayName: "Barbed Bat",
    boost: 5,
    stackBoost: 5,
    boostType: "add",
    target: "attr",
    attr: "attack",
    desc: "",
    detailedDesc: "Adds a 5 (+5 per stack) to attack",
  },
  {
    name: "chainmail",
    displayName: "Chainmail",
    boost: 5,
    stackBoost: 5,
    boostType: "add",
    target: "attr",
    attr: "defense",
    desc: "",
    detailedDesc: "Adds a 5 (+5 per stack) to defense",
  },
  {
    name: "treeBark",
    displayName: "Tree Bark",
    boost: 15,
    stackBoost: 5,
    boostType: "add",
    target: "attr",
    attr: "hp",
    desc: "",
    detailedDesc: "Recover 15 (+5 per stack) hp after combat",
  },
  {
    name: "textbook",
    displayName: "Textbook",
    boost: 5,
    stackBoost: 5,
    boostType: "mult",
    target: "self",
    attr: "xp",
    desc: "Filled with knowledge",
    detailedDesc: "Gain 5% (+5% per stack) more experience",
  },
  {
    name: "siphon",
    displayName: "Siphon",
    boost: 0.5,
    stackBoost: 0.5,
    boostType: "mult",
    target: "heal",
    attr: "health",
    desc: "",
    detailedDesc: "Heal for 0.5% (+0.5% per stack) health per damage dealt",
  },
  {
    name: "oil",
    displayName: "Oil of Slipperiness",
    boost: 10,
    stackBoost: 10,
    boostType: "add",
    target: "attr",
    attr: "flee",
    desc: "",
    detailedDesc: "Adds a 10% (+10% per stack) chance to flee",
  },
  {
    name: "blankCheck",
    displayName: "Blank Check",
    boost: 10,
    stackBoost: 10,
    boostType: "mult",
    target: "self",
    attr: "coin",
    desc: "",
    detailedDesc: "Gain an extra 10% (+10% per stack) coin after combat",
  },
  {
    name: "molotov",
    displayName: "Molotov Cocktail",
    boost: 10,
    stackBoost: 10,
    boostType: "",
    target: "enemy",
    attr: "effect",
    desc: "Shaken not stirred",
    detailedDesc: "Gain 10% (+10% per stack) chance to inflict BURN on enemy",
  },
  // {
  //   name: "magnifyingGlass",
  //   displayName: "magnifyingGlass",
  //   boost: 5,
  //   stackBoost: 5,
  //   boostType: "",
  //   target: "enemy",
  //   attr: "effect",
  //   desc: "",
  //   detailedDesc:
  //     "Gain 5% (+5% per stack) chance of gaining a consumable after defeating an enemy",
  // },
];

const uncommonItems = [
  {
    name: "sunglasses",
    displayName: "Mirrored Sunglasses",
    boost: 5,
    stackBoost: 5,
    boostType: "mult",
    target: "self",
    attr: "evasion",
    desc: "So shiny",
    detailedDesc: "Adds a 5% (+5% per stack) chance to evade an enemy attack",
  },
  {
    name: "wallet",
    displayName: "Empty Wallet",
    boost: 2,
    stackBoost: 1,
    boostType: "mult",
    target: "enemy",
    attr: "damage",
    desc: "",
    detailedDesc: "Deal extra damage equal to 2% (+1% per stack) of your coin",
  },
  {
    name: "rareCoin",
    displayName: "Rare Coin",
    boost: 1,
    stackBoost: 1,
    boostType: "mult",
    target: "self",
    attr: "coin",
    desc: "",
    detailedDesc: "Gain coin equal to 1% (+1% per stack) of damage taken",
  },
  {
    name: "ironGauntlet",
    displayName: "Iron Gauntlet",
    boost: 1,
    stackBoost: 1,
    boostType: "add",
    target: "self",
    attr: "maxHP",
    desc: "",
    detailedDesc: "Gain 1 (+1 per stack) max HP after combat",
  },
  {
    name: "moonshine",
    displayName: "Moonshine",
    boost: 10,
    stackBoost: 10,
    boostType: "",
    target: "enemy",
    attr: "effect",
    desc: "Homemade",
    detailedDesc: "Gain 10% (+10% per stack) chance to inflict POISON on enemy",
  },
  // {
  //   name: "sneakers",
  //   displayName: "Old Sneakers",
  //   boost: 10,
  //   stackBoost: 10,
  //   boostType: "mult",
  //   target: "self",
  //   attr: "walking",
  //   desc: "",
  //   detailedDesc: "Adds a 10% (+10% per stack) movement speed in the overworld",
  // },
  {
    name: "pointyRock",
    displayName: "Pointy Rock",
    boost: 10,
    stackBoost: 10,
    boostType: "",
    target: "enemy",
    attr: "effect",
    desc: "",
    detailedDesc: "Gain 10% (+10% per stack) chance to inflict BROKEN on enemy",
  },
  // {
  //   name: "paddedArmor",
  //   displayName: "Padded Armor",
  //   boost: 5,
  //   stackBoost: 5,
  //   boostType: "add",
  //   target: "enemy",
  //   attr: "critChance",
  //   desc: "",
  //   detailedDesc: "Reduce enemy crit chance by 5% (5% per stack)",
  // },
];

const rareItems = [
  // {
  //   name: "finalFight",
  //   displayName: "Final Fight",
  //   boost: 1,
  //   stackBoost: 1,
  //   boostType: "mult",
  //   target: "self",
  //   attr: "damage",
  //   desc: "Do not go quietly into the night",
  //   detailedDesc:
  //     "Deals an additional 1% damage (+1% per stack) for each 1% of missing health",
  // },
  // {
  //   name: "shinobiMask",
  //   displayName: "Shinobi Mask",
  //   boost: 25,
  //   stackBoost: 15,
  //   boostType: "mult",
  //   target: "self",
  //   attr: "",
  //   desc: "",
  //   detailedDesc:
  //     "Gain 50% (+15% per stack) chance to get a free attack at the start of combat",
  // },
  // {
  //   name: "joker",
  //   displayName: "Joker",
  //   boost: 0,
  //   stackBoost: 0,
  //   boostType: "flat",
  //   target: "self",
  //   attr: "",
  //   desc: "Faster than fast",
  //   detailedDesc: "Reroll for an item once per chest",
  // },
  // {
  //   name: "ballAndChain",
  //   displayName: "Ball & Chain",
  //   boost: 1,
  //   stackBoost: 1,
  //   boostType: "add",
  //   target: "enemy",
  //   attr: "speed",
  //   desc: "Faster than fast",
  //   detailedDesc: "Reduce enemy speed by 1 (+1 per stack) each attack",
  // },
  // {
  //   name: "giantLeech",
  //   displayName: "Giant Leech",
  //   boost: 1,
  //   stackBoost: 1,
  //   boostType: "heal",
  //   target: "heal",
  //   attr: "health",
  //   desc: "Faster than fast",
  //   detailedDesc:
  //     "10% chance (+5% per stack) to recover 5% health (+5% per stack) after attacking",
  // },
  // {
  //   name: "energyDrink",
  //   displayName: "Energy Drink",
  //   boost: 1,
  //   stackBoost: 1,
  //   boostType: "add",
  //   target: "self",
  //   attr: "cooldown",
  //   desc: "",
  //   detailedDesc: "Reduce 2nd ability cooldown by 1 turn (+1 per stack)",
  // },
];

const legendaryItems = [
  {
    name: "wingedBoots",
    displayName: "Winged Boots",
    boost: 20,
    stackBoost: 5,
    boostType: "add",
    target: "attr",
    attr: "speed",
    desc: "Faster than fast",
    detailedDesc: "Gain 20 (+5 per stack) speed",
  },
  // {
  //   name: "glowingStone",
  //   displayName: "Glowing Stone",
  //   boost: 50,
  //   stackBoost: 5,
  //   boostType: "mult",
  //   target: "self",
  //   attr: "",
  //   desc: "Faster than fast",
  //   detailedDesc: "Gain 50% (+5% per stack) chance to attack twice",
  // },
  // {
  //   name: "turtleneck",
  //   displayName: "Turtleneck",
  //   boost: 0,
  //   stackBoost: 0,
  //   boostType: "flat",
  //   target: "self",
  //   attr: "def",
  //   desc: "",
  //   detailedDesc:
  //     "When health drops below 10% (+5% per stack) you will be immune to the next attack. Occurs 1 per combat.",
  // },
];

const bossItems = [
  {
    name: "stoneHelmet",
    displayName: "Stone Helmet",
    ability: {
      name: "Earthquake",
      desc: "Deal damage to all enemies equal to 20% of their Max HP",
      cooldown: 5,
    },
  },
];

const weapons = [
  {
    name: "sword",
    class: "knight",
    type: "boost",
    attr: "atk",
    boost: 5,
    desc: "increase atk by 5",
  },
];

let itemChance = [50, 35, 12, 3];
//Gives player a random item
function gainItem(specItem) {
  let item = specItem;
  let type;
  if (!item) {
    const itemPoolNumber = random100();

    let itemPool;

    if (itemPoolNumber <= itemChance[0]) {
      itemPool = commonItems;
      type = "common";
    } else if (
      itemPoolNumber > itemChance[0] &&
      itemPoolNumber <= itemChance[0] + itemChance[1]
    ) {
      itemPool = uncommonItems;
      type = "uncommon";
    } else if (
      itemPoolNumber > itemChance[0] + itemChance[1] &&
      itemPoolNumber <= itemChance[0] + itemChance[1] + itemChance[2]
    ) {
      itemPool = rareItems;
      type = "rare";
    } else if (
      itemPoolNumber > itemChance[0] + itemChance[1] + itemChance[2] &&
      itemPoolNumber <=
        itemChance[0] + itemChance[1] + itemChance[2] + itemChance[3]
    ) {
      itemPool = legendaryItems;
      type = "legendary";
    }

    const itemNumber = Math.floor(Math.random() * itemPool.length);

    item = itemPool[itemNumber];
  }
  let itemObj;
  //If the item already exists, then stack it
  if (player.items.find((obj) => obj.name === item.name)) {
    itemObj = player.items.find((obj) => obj.name === item.name);
    itemObj.stack++;
  }
  //otherwise add it
  else {
    itemObj = structuredClone(item);
    itemObj.stack = 1;
    itemObj.type = type;
    player.items.push(itemObj);
  }

  addMessage("You gained " + item.name);

  applyItemEffect(itemObj);

  const playerItems = document.getElementById("player-items");
  playerItems.innerHTML = "";
  player.items.forEach((el) => {
    playerItems.innerHTML += `<div class='tooltip'><span class='item-${el.type}'>${el.displayName}:</span> ${el.stack} <span class='tooltip-text'>${el.detailedDesc}</span></div>`;
  });
}

//Applies item stat to hero
function applyItemEffect(item) {
  if (item.target === "attr") {
    let boost;
    if (item.stack == 1) {
      boost = item.boost;
    } else {
      boost = item.stackBoost;
    }
    if (item.boostType == "add") {
      player[item.attr] += boost;
      //Figure out the multiplier
      // } else if (item.boostType == "mult") {
      //   player[item.attr] = player[item.attr] * boost;
    }
  }
}
