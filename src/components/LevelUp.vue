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
        <h2 id="point-name">{{ store.hero.class }} {{ store.heroName }}</h2>
        <h3 id="point-level">Level {{ store.hero.level }}</h3>
        <h3 id="point-total">Points - {{ store.heroStats.levelPoints }}</h3>
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
      <div id="button-container">
        <button
          class="primary-button"
          :class="store.heroStats.levelPoints > 0 ? 'disabled' : ''"
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
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  left: 10;
  width: 1024px;
  height: 648px;
  background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
  z-index: 9999; /* Ensure it's above other content */
}

.full-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
}

#point-holder {
  background-color: white;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  width: 256px;
}

.point-attr {
  font-size: 28px;
}
.point-value {
  font-size: 24px;
  text-align: center;
}

#button-container {
  display: flex;
  justify-content: center;
}

/* Styling for point-change-button */
.point-change-button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 0.3s;
}

.point-change-button:hover {
  background-color: #45a049; /* Darker green */
}

/* Styling for level-up-button */
.primary-button {
  background-color: #ff001e;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.primary-button.disabled {
  background-color: #ae868b !important;
}

.primary-button:hover {
  background-color: #b80016;
}
</style>
