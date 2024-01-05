<script setup>
import { onMounted } from "vue";

import { useMainStore } from "../stores/mainStore";

import StartScreen from "./components/StartScreen.vue";

import PlayerHud from "./components/PlayerHud.vue";
import PlayerActions from "./components/PlayerActions.vue";

const store = useMainStore();

onMounted(() => {});
</script>

<template>
  <div v-if="store.elementStates.startScreen">
    <StartScreen></StartScreen>
  </div>
  <div>
    <PlayerHud v-if="store.elementStates.playerHud"></PlayerHud>

    <canvas v-show="store.elementStates.gameCanvas" id="game-canvas"></canvas>

    <PlayerActions v-if="store.elementStates.playerActions"></PlayerActions>
  </div>
</template>

<style scoped>
#game-canvas {
  width: 512px;
  height: 256px;
}
</style>
