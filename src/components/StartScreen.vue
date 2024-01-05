<script setup>
import { useMainStore } from "../../stores/mainStore";
import heroData from "../../js/hero";

const store = useMainStore();
const hero = heroData();

let heroName = $ref("");
let startScreenOpen = $ref(true);
let classPickerOpen = $ref(false);
let currentClassIndex = $ref(0);

function toggleClass(isPositive) {
  if (isPositive) {
    currentClassIndex++;
    if (currentClassIndex >= hero.classes.length) {
      currentClassIndex = 0;
    }
  } else {
    currentClassIndex--;
    if (currentClassIndex < 0) {
      currentClassIndex = hero.classes.length - 1;
    }
  }
}
</script>

<template>
  <!-- Start Screen -->
  <div class="overlay full-overlay" id="start-screen" v-if="startScreenOpen">
    <h2>Untitled</h2>
    <h5>Game by knightwatch98</h5>
    <button
      id="startButton"
      @click="
        startScreenOpen = false;
        classPickerOpen = true;
      "
      class="primary-button"
    >
      Start Game
    </button>
  </div>

  <!-- Class Selection -->
  <div id="class-picker-container" v-if="classPickerOpen">
    <input
      type="text"
      id="character-name-input"
      placeholder="Enter your character's name"
      v-bind="heroName"
      @input="store.heroName = heroName"
    />
    <div>
      <div class="class-picker">
        <div v-for="(charClass, index) in hero.classes">
          <table
            v-if="index === currentClassIndex"
            :id="'class-info-' + index"
            class="class-info"
          >
            <tr>
              <td>
                <img :src="charClass.classImg" class="class-image" />
              </td>
              <td class="class-name">{{ charClass.name }}</td>
            </tr>
            <tr>
              <td>HP</td>
              <td>{{ charClass.maxHP }}</td>
            </tr>
            <tr>
              <td>ATK</td>
              <td>{{ charClass.attack }}</td>
            </tr>
            <tr>
              <td>DEF</td>
              <td>{{ charClass.defense }}</td>
            </tr>
            <tr>
              <td>SPD</td>
              <td>{{ charClass.speed }}</td>
            </tr>
            <tr>
              <td>CRT</td>
              <td>{{ charClass.critChance }}</td>
            </tr>
            <tr>
              <td>Ability</td>
              <td>{{ charClass.secondAbility.name }}</td>
            </tr>
            <tr>
              <td colspan="2" class="class-skills">
                {{ charClass.secondAbility.desc }}
              </td>
            </tr>
            <tr>
              <td>Cooldown</td>
              <td>{{ charClass.secondAbility.cooldown }}</td>
            </tr>
            <tr>
              <td>Passive</td>
              <td>{{ charClass.passive.name }}</td>
            </tr>
            <tr>
              <td colspan="2" class="class-skills">
                {{ charClass.passive.desc }}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <button class="prev-button" @click="toggleClass(false)">&lt;</button>
      <button class="next-button" @click="toggleClass(true)">&gt;</button>
    </div>

    <button
      @click="store.startGame(currentClassIndex)"
      class="primary-button"
      id="select-class-button"
    >
      Start
    </button>
  </div>
</template>
