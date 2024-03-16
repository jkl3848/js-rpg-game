<script setup>
import { useMainStore } from "../../stores/mainStore";

const store = useMainStore();
</script>

<template>
  <div id="game-message" v-if="store.gameMessage.length > 0">
    {{ store.gameMessage }}
  </div>
</template>

<style scoped>
#game-message {
  position: absolute;
  top: 96px;
  left: 206px;

  width: 512px;
  height: 24px;

  background-color: rgba(80, 80, 80, 0.6);
  color: white;

  border-radius: 25px;
  padding: 8px;

  text-align: center;
}
</style>
