const consumables = [
  {
    name: "smallPotion",
    displayName: "Small Potion",
    type: "heal",
    attr: "currentHP",
    boost: 50,
    desc: "heal by 50",
  },
];

function gainConsumable(item) {
  if (!item) {
    const itemNumber = Math.floor(Math.random() * consumables.length);

    item = consumables[itemNumber];
  } else {
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
  }

  updateBackpack();
}

function useConsumable(itemName) {
  const item = player.backpack.find((obj) => obj.name === itemName);
  console.log(item);

  if (!item) {
    return;
  }

  if (item.type === "heal") {
    if (player.currentHP < player.maxHP) {
      console.log("healing");
      player.currentHP += item.boost;
      if (player.currentHP > player.maxHP) {
        player.currentHP = player.maxHP;
      }

      if (item.stack > 1) {
        item.stack--;
      } else {
        player.backpack = player.backpack.filter(
          (obj) => obj.name === itemName
        );
      }

      updateHealth(turnQueue);
    }
  }
  updateBackpack();
}

function updateBackpack() {
  for (let i = 0; i < consumables.length; i++) {
    const item = player.backpack[i];
    const itemSlot = document.getElementById(item.name);

    itemSlot.innerHTML = `${item.displayName}: ${item.stack}`;
  }
}
