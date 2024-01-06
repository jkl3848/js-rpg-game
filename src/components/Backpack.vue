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
        ></td>
      </tr>
    </table>
  </div>
</template>
