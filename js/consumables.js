import { useMainStore } from "../stores/mainStore";
import damageFuncs from "./damage";
import healthFuncs from "./health";

export const consumableFuncs = () => {
  const store = useMainStore();
  const damage = damageFuncs();
  const health = healthFuncs();

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
    if (store.hero.backpack.find((obj) => obj.name === item.name)) {
      itemObj = store.hero.backpack.find((obj) => obj.name === item.name);
      itemObj.stack++;
    }
    //otherwise add it
    else {
      itemObj = structuredClone(item);
      itemObj.stack = 1;
      store.hero.backpack.push(itemObj);
    }

    store.gameMessage = "Gained " + item.name;

    updateBackpack();
  }

  function useConsumable(itemName) {
    const item = store.hero.backpack.find((obj) => obj.name === itemName);

    const poison = store.hero.effects.find((item) => item.type === "poison");
    const burn = store.hero.effects.find((item) => item.type === "burn");
    const broken = store.hero.effects.find((item) => item.type === "broken");

    if (!item) {
      return;
    }

    if (item.type === "heal") {
      if (store.hero.currentHP < store.hero.maxHP) {
        console.log("healing");
        store.hero.currentHP += item.boost;
        health.balanceHealth();
      } else {
        return;
      }
    } else if (inCombat) {
      if (item.name === "adrenaline") {
        secondCooldown = 0;
      } else if (item.name === "gingerRoot") {
        if (!poison) {
          return;
        }
        if (poison.stack > 1) {
          poison.stack--;
        } else {
          store.hero.effects = store.hero.effects.filter(
            (item) => item.type !== "poison"
          );
        }
      } else if (item.name === "fireExtinguisher") {
        if (!burn) {
          return;
        }

        if (burn.stack > 1) {
          burn.stack--;
        } else {
          store.hero.effects = store.hero.effects.filter(
            (item) => item.type !== "burn"
          );
        }
      } else if (item.name === "ductTape") {
        if (!broken) {
          return;
        }

        if (broken.stack > 1) {
          broken.stack--;
        } else {
          store.hero.effects = store.hero.effects.filter(
            (item) => item.type !== "broken"
          );
        }
      } else if (item.name === "fireCracker") {
        damage.applyStatusEffect(store.hero, store.heroTarget, "burn", 3);
      } else if (item.name === "rawChicken") {
        damage.applyStatusEffect(store.hero, store.heroTarget, "poison", 3);
      } else if (item.name === "bomb") {
        let enemyList = turnQueue.filter((item) => !item.player);
        for (let i = 0; i < enemyList.length; i++) {
          let target = enemyList[i];

          target.currentHP -= Math.floor(target.maxHP * 0.1);
        }
      }
    } else {
      return;
    }

    if (item.stack > 1) {
      item.stack--;
    } else {
      store.hero.backpack = store.hero.backpack.filter(
        (obj) => obj.name !== item.name
      );
    }

    updateBackpack();
  }

  function updateBackpack() {
    for (let i = 0; i < consumables.length; i++) {
      const item = consumables[i];
      const itemSlot = document.getElementById(item.name);
      let stack = 0;
      const packItem = store.hero.backpack.find(
        (obj) => obj.name === item.name
      );

      if (packItem) {
        stack = packItem.stack;
      }

      itemSlot.innerHTML = `<span class='consum-stack'>${item.displayName}: ${stack}</span><span class='tooltip-text'>${item.desc}</span>`;
    }
  }
  return {
    consumables,
    gainConsumable,
    useConsumable,
    updateBackpack,
  };
};

export default consumableFuncs;
