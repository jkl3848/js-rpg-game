<script setup>
import { useMainStore } from "../../stores/mainStore";

const store = useMainStore();

function spendPoint(isAdding, attr) {
  let upgradeAmount = 1;
  //If adding to an attribute
  if (attr === "maxHP") {
    upgradeAmount *= 10;
  }
  if (isAdding) {
    if (store.heroStats.levelPoints > 0) {
      store.heroStats.levelPoints--;
      store.hero[attr] += upgradeAmount;
    }
  } else {
    if (store.heroStats.levelPoints < 4) {
      store.heroStats.levelPoints++;

      store.hero[attr] -= upgradeAmount;
    }
  }
}
</script>

<template>
  <!-- Level up point allocator -->
  <div class="overlay full-overlay" id="point-allocator">
    <div id="point-holder">
      <div id="point-allocator-header">
        <h2 id="point-name"></h2>
        <h2 id="point-level"></h2>
        <h2 id="point-total"></h2>
      </div>

      <div id="point-allocator-points">
        <table>
          <tr class="point-section">
            <td class="point-attr">HP</td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(false, 'maxHP')"
              >
                -
              </button>
            </td>
            <td class="point-value" id="point-maxHP-value">
              {{ store.hero.maxHP }}
            </td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(true, 'maxHP')"
              >
                +
              </button>
            </td>
          </tr>
          <tr class="point-section">
            <td class="point-attr">ATK</td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(false, 'attack')"
              >
                -
              </button>
            </td>
            <td class="point-value" id="point-attack-value">
              {{ store.hero.attack }}
            </td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(true, 'attack')"
              >
                +
              </button>
            </td>
          </tr>

          <tr class="point-section">
            <td class="point-attr">DEF</td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(false, 'defense')"
              >
                -
              </button>
            </td>
            <td class="point-value" id="point-defense-value">
              {{ store.hero.defense }}
            </td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(true, 'defense')"
              >
                +
              </button>
            </td>
          </tr>

          <tr class="point-section">
            <td class="point-attr">SPD</td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(false, 'speed')"
              >
                -
              </button>
            </td>
            <td class="point-value" id="point-speed-value">
              {{ store.hero.speed }}
            </td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(true, 'speed')"
              >
                +
              </button>
            </td>
          </tr>
          <tr class="point-section">
            <td class="point-attr">CRT</td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(false, 'critChance')"
              >
                -
              </button>
            </td>
            <td class="point-value" id="point-critChance-value">
              {{ store.hero.critChance }}
            </td>
            <td>
              <button
                class="point-change-button"
                @click="spendPoint(true, 'critChance')"
              >
                +
              </button>
            </td>
          </tr>
        </table>
      </div>
      <button
        class="primary-button"
        @click="
          store.elementStates.levelUp = false;
          store.moveLock = false;
        "
        id="level-up-button"
        :disabled="store.heroStats.levelPoints > 0"
      >
        Level Up
      </button>
    </div>
  </div>
</template>
