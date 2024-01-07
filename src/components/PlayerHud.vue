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
    <div class="hud-item">
      <span id="player-level" class="hud-item"></span
      ><span id="player-money"></span>
      <span @click="togglePlayerStats" id="info-button"
        ><img src="../../public/assets/icons/info_icon.png"
      /></span>
    </div>
  </div>

  <div id="hp-bar">
    <div id="current-hp">
      <span
        id="player-hp"
        class="hud-item bar-text"
        :width="1024 * (store.hero.currentHP / store.hero.maxHP) + 'px'"
      >
        {{ store.hero.currentHP + "/" + store.hero.maxHP }}
      </span>
    </div>
  </div>

  <div id="xp-bar">
    <div id="current-xp">
      <span
        id="player-xp"
        class="hud-item bar-text"
        :width="1024 * (store.hero.xp / store.heroStats.nextXPLevel) + 'px'"
        >{{ store.hero.xp + "/" + store.heroStats.nextXPLevel }}</span
      >
    </div>
  </div>
</template>

<style scoped>
.hud {
  width: 1024px;
}

#hp-bar {
  width: 1024px;
}

#player-hp {
  background-color: red;
}

#xp-bar {
  width: 1024px;
}

#player-xp {
  background-color: green;
}
</style>
