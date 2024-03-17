<script setup>
import { useMainStore } from "../../stores/mainStore";

const store = useMainStore();

function togglePlayerStats() {
  store.elementStates.playerStats = !store.elementStates.playerStats;
}
</script>

<template>
  <!-- Top HUD -->
  <div class="hud">
    <div class="hud-item">
      <span id="player-class">{{ store.hero.class }}</span
      ><span id="player-name">{{ store.heroName }}</span>
    </div>
    <div class="flex-left">
      <div class="hud-item player-deets">
        <span id="player-level">Level {{ store.hero.level }}</span
        ><span id="player-money"
          ><span class="money-flip">&#65510;</span> {{ store.hero.money }}</span
        >
      </div>
      <div class="hud-item">
        <span @click="togglePlayerStats" id="info-button"
          ><img src="../../assets/icons/info_icon.png"
        /></span>
      </div>
    </div>
  </div>

  <div id="hp-bar">
    <span
      id="player-hp"
      class="stat-bar"
      :style="{
        width: 1024 * (store.hero.currentHP / store.hero.maxHP) + 'px',
      }"
    >
    </span
    ><span class="bar-text"
      >HP: {{ store.hero.currentHP + "/" + store.hero.maxHP }}</span
    >
  </div>

  <div id="xp-bar">
    <span
      id="player-xp"
      class="stat-bar"
      :style="{
        width: 1024 * (store.hero.xp / store.heroStats.nextXPLevel) + 'px',
      }"
    ></span
    ><span class="bar-text"
      >XP: {{ store.hero.xp + "/" + store.heroStats.nextXPLevel }}</span
    >
  </div>
</template>

<style scoped>
.hud {
  width: 1024px;
  height: 48px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  color: white; /* Text color */
  padding: 10px; /* Adjust padding as needed */
  box-sizing: border-box; /* Ensure padding doesn't affect width */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.hud-item {
  display: inline-block;
  margin-right: 20px; /* Adjust margin between items as needed */
}

#player-class,
#player-name,
#player-level,
#player-money {
  margin-right: 10px; /* Adjust margin between text elements as needed */
}

#info-button {
  cursor: pointer;
}

#info-button img {
  margin: -10px;
}

.player-deets {
  display: flex;
  flex-direction: column;
}

.flex-left {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.money-flip {
  display: inline-block;
  transform: rotate(180deg);
}

#player-xp {
  background-color: green;
}

#player-hp {
  background-color: red;
}

#hp-bar,
#xp-bar {
  width: 1024px;
  position: relative;
  background-color: #ccc; /* Background color of the bars */
}

.stat-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.bar-text {
  position: relative;
  z-index: 2; /* Ensure text appears above the bars */
  display: block;
  text-align: center;
  line-height: 20px; /* Adjust line height to vertically center text */
  color: white; /* Color of the text */
  font-size: 14px; /* Adjust font size as needed */
  font-family: Arial, sans-serif; /* Adjust font family as needed */
}
</style>
