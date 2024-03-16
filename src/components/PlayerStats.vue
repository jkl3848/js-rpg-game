<script setup>
import { useMainStore } from "../../stores/mainStore";

const store = useMainStore();

function chunkedItems() {
  const itemsPerRow = 8;
  const chunks = [];
  for (let i = 0; i < store.hero.items.length; i += itemsPerRow) {
    chunks.push(store.hero.items.slice(i, i + itemsPerRow));
  }
  return chunks;
}
</script>

<template>
  <!-- Player Menu -->
  <div class="overlay half-overlay" id="player-menu">
    <button
      @click="store.elementStates.playerStats = false"
      id="close-overlay-button"
    >
      X
    </button>

    <!-- Player Info -->
    <div class="player-info">
      <div id="player-name" class="hud-item">{{ store.hero.name }}</div>
      <div id="player-class" class="hud-item">
        Class: {{ store.hero.class }}
      </div>
      <div id="player-level" class="hud-item">
        Level: {{ store.hero.level }}
      </div>
      <div id="player-hp" class="hud-item">HP: {{ store.hero.currentHP }}</div>
      <div id="player-xp" class="hud-item">XP: {{ store.hero.xp }}</div>
      <div id="player-money" class="hud-item">Gold: {{ store.hero.money }}</div>
      <div id="player-stats"></div>
    </div>

    <!-- Player Items -->
    <div id="player-items">
      <table id="item-table">
        <tr v-for="(row, index) in chunkedItems()" :key="index">
          <td
            v-for="(item, cellIndex) in row"
            class="pack-item tooltip"
            :id="item.name"
            :deets="item.desc"
          >
            {{ item.displayName }}
            <span v-if="item.stack > 1">{{ item.stack }}x</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 33%;
  left: 40%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  padding: 40px;
  border-radius: 10px;

  width: 512px;
  height: 256px;

  color: white;
}

#close-overlay-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

#player-items {
  margin-top: 20px;
}

#item-table {
  width: 100%;
  border-collapse: collapse;
}

.pack-item {
  padding: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  width: 40px;
}

.pack-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.pack-item.disabled {
  color: gray;
}

.tooltip {
  position: relative;
}

.tooltip:hover::after {
  content: attr(deets); /* You can modify this as per your requirement */
  position: absolute;
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 5px;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  font-size: 12px;
}
</style>
