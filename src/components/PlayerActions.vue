<script setup>
import { useCombatStore } from "../../stores/combat";
import { useMainStore } from "../../stores/mainStore";

const store = useMainStore();
const combat = useCombatStore();
</script>

<template>
  <!-- Bottom HUD -->
  <div class="hud" id="action-buttons">
    <div class="tooltip" v-if="combat.inCombat">
      <button class="action-button" id="attackButton">Attack</button
      ><span class="tooltip-text">Attack for 100% damage</span>
    </div>
    <div class="tooltip" v-if="combat.inCombat">
      <button class="action-button" id="2ndActionButton">2nd Action</button
      ><span class="tooltip-text" id="2ndActionTooltip"></span>
    </div>
    <div class="tooltip" v-if="combat.inCombat">
      <button class="action-button" id="fleeButton">Flee</button
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
  background-color: darkred;
  color: white;

  width: 80px;
  height: 30px;

  border: none;
  border-radius: 15px;
}
</style>
