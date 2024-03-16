import { useMainStore } from "../stores/mainStore";

export const healthFuncs = () => {
  const store = useMainStore();

  //Heals hero after combat
  function postCombatHeal() {
    let healTotal;

    healTotal = store.hero.maxHP * 0.05;

    if (store.hero.class === "knight") {
      healTotal += Math.ceil(healTotal * 0.05);
    }

    let bark = store.hero.items.find((item) => item.name === "treeBark");
    let gauntlet = store.hero.items.find(
      (item) => item.name === "ironGauntlet"
    );

    if (bark) {
      let heal = bark.boost;
      if (bark.stack > 1) {
        heal += bark.stackBoost * bark.stack - 1;
      }
      healTotal += heal;
    }

    if (gauntlet) {
      store.hero.maxHP += gauntlet.stack;
    }

    if (healTotal > 1) {
      healTotal = Math.floor(healTotal);
    } else if (healTotal > 0 && healTotal < 1) {
      healTotal = 1;
    }

    store.hero.currentHP += healTotal;

    store.gameMessage = "Healed for " + healTotal;
    balanceHealth();
  }

  //Heals user based on damage dealt to target
  function healthSteal(damage) {
    if (store.hero.items.length > 0) {
      let siphon = store.hero.items?.find((item) => item.name === "siphon");
      if (siphon) {
        const healAmount = Math.ceil(damage * (siphon.stack / 100));
        store.hero.currentHP += healAmount;
        store.gameMessage = "Healed for " + healAmount;
      }
    }
    balanceHealth();
  }

  function balanceHealth() {
    if (store.hero.currentHP > store.hero.maxHP) {
      setHealthToMax(store.hero);
    }
  }

  function setHealthToMax(target) {
    target.currentHP = target.maxHP;
  }

  return {
    postCombatHeal,
    healthSteal,
    balanceHealth,
    setHealthToMax,
  };
};

export default healthFuncs;
