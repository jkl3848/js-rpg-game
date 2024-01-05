<template>
  <!-- Player Menu -->
  <div class="overlay half-overlay" id="player-menu">
    <button onclick="clearAllOverlays()" id="close-overlay-button">X</button>
    <!-- <div class="player-info">
          <div id="player-name" class="hud-item">Player Name</div>
          <div id="player-class" class="hud-item">Class: Warrior</div>
          <div id="player-level" class="hud-item">Level: 1</div>
          <div id="player-hp" class="hud-item">HP: 100/100</div>
          <div id="player-xp" class="hud-item">XP: 0/100</div>
          <div id="player-money" class="hud-item">Gold: 0</div>
          <div id="player-stats"></div>
        </div> -->

    <div id="player-stats"></div>
    <div id="player-items"></div>
  </div>
</template>
