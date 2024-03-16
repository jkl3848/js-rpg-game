<script setup>
import { onMounted } from "vue";

import { useMainStore } from "../stores/mainStore";
import { useCombatStore } from "../stores/combat";

import StartScreen from "./components/StartScreen.vue";
import PlayerHud from "./components/PlayerHud.vue";
import PlayerActions from "./components/PlayerActions.vue";
import Backpack from "./components/Backpack.vue";
import GameMessages from "./components/GameMessages.vue";
import LevelUp from "./components/LevelUp.vue";

const store = useMainStore();
const combat = useCombatStore();

function toggleEnemy(isDown) {
  if (!combat.inCombat) {
    return;
  }
  const currentId = combat.playerTarget.combatId;
  let newId;

  if (isDown) {
    newId = currentId + 1;
    if (newId > combat.combatEnemies.length) {
      newId = 1;
    }
  } else {
    newId = currentId - 1;
    if (newId < 1) {
      newId = combat.combatEnemies.length;
    }
  }

  combat.setTarget(newId);
}

onMounted(() => {
  window.addEventListener("keydown", (event) => {
    if (event.key === "s" || event.key === "ArrowDown") {
      toggleEnemy(true);
    }
    if (event.key === "w" || event.key === "ArrowUp") {
      toggleEnemy(false);
    }
  });
});
</script>

<template>
  <!-- This is for full screens. Start, game over -->
  <StartScreen v-if="store.elementStates.startScreen" />
  <LevelUp v-if="store.elementStates.levelUp" />

  <!-- This is for the main game elements -->
  <div id="main-game-section">
    <PlayerHud v-if="store.elementStates.playerHud"></PlayerHud>

    <GameMessages></GameMessages>

    <canvas
      v-show="store.elementStates.gameCanvas"
      id="game-canvas"
      width="1024"
      height="512"
    ></canvas>

    <PlayerActions v-if="store.elementStates.playerActions"></PlayerActions>
  </div>

  <!-- This is for game overlays -->
  <div id="overlays-section">
    <Backpack v-if="store.elementStates.backpackOpen"></Backpack>
  </div>

  <!-- Dev space -->
  <div></div>
</template>

<style scoped>
#game-canvas {
  width: 1024px;
  height: 512px;
}
</style>
