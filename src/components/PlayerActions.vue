<script setup></script>

<template>
    <!-- Bottom HUD -->
    <div class="hud" id="action-buttons">
      <div class="tooltip">
        <button class="action-button" id="attackButton">Attack</button
        ><span class="tooltip-text">Attack for 100% damage</span>
      </div>
      <div class="tooltip">
        <button class="action-button" id="2ndActionButton">2nd Action</button
        ><span class="tooltip-text" id="2ndActionTooltip"></span>
      </div>
      <div class="tooltip">
        <button class="action-button" id="fleeButton">Flee</button
        ><span class="tooltip-text">Flee from combat</span>
      </div>
      <div class="tooltip">
        <button
          class="action-button"
          id="backpackButton"
          onclick="toggleBackpack()"
        >
          Backpack</button
        ><span class="tooltip-text">Open Backpack</span>
      </div>
    </div>
</template>

<style></style>