<script setup>

</script>

<template>
    <!-- Top HUD -->
    <div class="hud">
      <div class="hud-item">
        <span id="player-class"></span><span id="player-name"></span>
      </div>
      <div class="hud-item">
        <span id="player-level" class="hud-item"></span
        ><span id="player-money"></span>
        <span onclick="togglePlayerMenu()" id="info-button">i</span>
      </div>
    </div>

    <div id="hp-bar">
      <div id="current-hp">
        <div id="player-hp" class="hud-item bar-text">100 HP</div>
      </div>
    </div>

    <div id="xp-bar">
      <div id="current-xp">
        <span id="player-xp" class="hud-item bar-text"></span>
      </div>
    </div>
</template>

<style scoped>
</style>