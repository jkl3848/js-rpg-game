<script setup>
import { useCombatStore } from "../../stores/combat";
import { useMainStore } from "../../stores/mainStore";

const store = useMainStore();
const combat = useCombatStore();

function playerAction(actionType) {
  if (actionType === "attack") {
    combat.attack(store.hero, combat.playerTarget);
  }

  combat.playerPostAction();
}
</script>

<template>
  <!-- Bottom HUD -->
  <div class="hud" id="action-buttons">
    <div class="tooltip" v-if="combat.inCombat">
      <button
        class="action-button"
        id="attackButton"
        :disabled="!combat.playerTurn"
        @click="playerAction('attack')"
      >
        Attack</button
      ><span class="tooltip-text">Attack for 100% damage</span>
    </div>
    <div class="tooltip" v-if="combat.inCombat">
      <button
        class="action-button"
        id="2ndActionButton"
        :disabled="combat.secondCooldown > 0 || !combat.playerTurn"
        @click="playerAction('2')"
      >
        2nd Action</button
      ><span class="tooltip-text" id="2ndActionTooltip"></span>
    </div>
    <div class="tooltip" v-if="combat.inCombat">
      <button
        class="action-button"
        id="fleeButton"
        :disabled="!combat.playerTurn"
        @click="playerAction('flee')"
      >
        Flee</button
      ><span class="tooltip-text">Flee from combat</span>
    </div>
    <div class="tooltip">
      <img src="../../public/assets/icons/backpack_icon.png" /><span
        class="tooltip-text"
        >Open Backpack</span
      >
    </div>
  </div>
</template>

<style>
.hud {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  background-color: gray;
  height: 40px;

  padding: auto;
}

.action-button {
  background-color: rgb(211, 16, 16);
  color: white;

  width: 80px;
  height: 30px;

  border: none;
  border-radius: 15px;
}

.action-button :disabled {
  opacity: 0.7;
}
</style>
