import { useMainStore } from "../stores/mainStore";

export const healthFuncs = () => {
  const store = useMainStore();

  //Heals hero after combat
  function postCombatHeal() {
    let healTotal;

    healTotal = player.maxHP * 0.05;

    if (player.class === "knight") {
      healTotal += Math.ceil(healTotal * 0.05);
    }

    let bark = player.items.find((item) => item.name === "treeBark");
    let gauntlet = player.items.find((item) => item.name === "ironGauntlet");

    if (bark) {
      let heal = bark.boost;
      if (bark.stack > 1) {
        heal += bark.stackBoost * bark.stack - 1;
      }
      healTotal += heal;
    }

    if (gauntlet) {
      player.maxHP += gauntlet.stack;
    }

    if (healTotal > 1) {
      healTotal = Math.floor(healTotal);
    } else if (healTotal > 0 && healTotal < 1) {
      healTotal = 1;
    }

    player.currentHP += healTotal;

    store.gameMessage = "Healed for " + healTotal;
    balanceHealth();
  }

  //Heals user based on damage dealt to target
  function healthSteal(damage) {
    if (player.items.length > 0) {
      let siphon = player.items?.find((item) => item.name === "siphon");
      if (siphon) {
        const healAmount = Math.ceil(damage * (siphon.stack / 100));
        player.currentHP += healAmount;
        store.gameMessage = "Healed for " + healAmount;
      }
    }
    balanceHealth();
  }

  function balanceHealth() {
    if (player.currentHP > player.maxHP) {
      setHealthToMax(player);
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
