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
              <td>
                <div class="ability-container">
                  <span class="ability-title">{{
                    charClass.secondAbility.name
                  }}</span
                  ><br />
                  <span class="ability-description">{{
                    charClass.secondAbility.desc
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Passive</td>
              <td>
                <div class="ability-container">
                  <span class="ability-title">{{ charClass.passive.name }}</span
                  ><br />
                  <span class="ability-description">{{
                    charClass.passive.desc
                  }}</span>
                </div>
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

<style scoped>
#start-screen {
  position: fixed;
  top: 33%;
  left: 40%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
}

#start-screen h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

#start-screen h5 {
  font-size: 16px;
  margin-bottom: 20px;
}

#startButton {
  background-color: #007bff; /* Blue */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

#startButton:hover {
  background-color: #0056b3; /* Darker blue */
}

#class-picker-container {
  position: fixed;
  top: 33%;
  left: 40%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  width: 512px;
  z-index: 9999;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
}

#character-name-input {
  width: 90%;
  padding: 10px;
  margin: auto;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.class-picker {
  width: 500px;
  height: 450px;
}

.class-info {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 10px;
  margin: 0 5px;
}

.class-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.class-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.class-skills {
  font-size: 14px;
  margin-top: 20px;
}

.prev-button,
.next-button {
  background-color: #c4c4c4;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 0 30px 0 30px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.prev-button:hover,
.next-button:hover {
  background-color: #e1e1e1; /* Darker blue */
}

#select-class-button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

#select-class-button:hover {
  background-color: #0056b3; /* Darker blue */
}
.ability-container {
  margin-top: 10px;
}

.ability-title {
  font-weight: bold;
}

.ability-description {
  font-style: italic;
  margin-top: 5px;
}

#class-picker-container table tr td:first-child {
  width: 100px;
}
</style>
