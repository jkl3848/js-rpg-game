<script setup>
import { useMainStore } from "../../stores/mainStore";
import consumableFuncs from "../../js/consumables";

const store = useMainStore();
const consumables = consumableFuncs();

function groupedItems(inputArray) {
  const groupSize = 4;
  const result = [];
  for (let i = 0; i < inputArray.length; i += groupSize) {
    result.push(inputArray.slice(i, i + groupSize));
  }
  return result;
}
</script>

<template>
  <!-- Backpack -->
  <div id="backpack-overlay">
    <button
      id="close-overlay-button"
      @click="store.elementStates.backpackOpen = false"
    >
      X
    </button>
    <table id="backpack">
      <tr
        class="pack-row"
        v-for="(row, index) in groupedItems(consumables.consumables)"
      >
        <td
          v-for="(item, cellIndex) in row"
          class="pack-item tooltip"
          @click="consumables.useConsumable(item.name)"
          :id="item.name"
        >
          {{ item.displayName }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
#backpack-overlay {
  position: fixed;
  top: 33%;
  left: 40%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  padding: 40px;
  border-radius: 10px;
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

#backpack {
  width: 100%;
  border-collapse: collapse;
}

.pack-row {
  border-bottom: 1px solid #ffffff;
}

.pack-item {
  padding: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.pack-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.tooltip {
  position: relative;
}

.tooltip:hover::after {
  content: attr(id);
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
