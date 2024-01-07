<script setup>
import { onMounted } from "vue";

import { useMainStore } from "../stores/mainStore";

import StartScreen from "./components/StartScreen.vue";

import PlayerHud from "./components/PlayerHud.vue";
import PlayerActions from "./components/PlayerActions.vue";
import Backpack from "./components/Backpack.vue";
import GameMessages from "./components/GameMessages.vue";

const store = useMainStore();

onMounted(() => {});
</script>

<template>
  <!-- This is for full screens. Start, game over -->
  <div v-if="store.elementStates.startScreen" id="screen-section">
    <StartScreen></StartScreen>
  </div>

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
