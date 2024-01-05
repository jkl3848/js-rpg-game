<template>
  <!-- Backpack -->
  <div class="overlay half-overlay" id="backpack-overlay">
    <button onclick="clearAllOverlays()" id="close-overlay-button">X</button>
    <table id="backpack">
      <tr class="pack-row">
        <td
          class="pack-item tooltip"
          onclick='useConsumable("smallPotion")'
          id="smallPotion"
        ></td>
        <td
          class="pack-item tooltip"
          onclick='useConsumable("largePotion")'
          id="largePotion"
        ></td>
        <td
          class="pack-item tooltip"
          onclick='useConsumable("gallonPotion")'
          id="gallonPotion"
        ></td>
        <td
          class="pack-item tooltip"
          onclick='useConsumable("adrenaline")'
          id="adrenaline"
        ></td>
      </tr>
      <tr class="pack-row">
        <td
          class="pack-item tooltip"
          onclick='useConsumable("gingerRoot")'
          id="gingerRoot"
        ></td>
        <td
          class="pack-item tooltip"
          onclick='useConsumable("fireExtinguisher")'
          id="fireExtinguisher"
        ></td>
        <td
          class="pack-item tooltip"
          onclick='useConsumable("ductTape")'
          id="ductTape"
        ></td>
        <td class="pack-item tooltip" onclick='useConsumable("")'>TBD</td>
      </tr>

      <tr class="pack-row">
        <td
          class="pack-item tooltip"
          onclick='useConsumable("fireCracker")'
          id="fireCracker"
        ></td>
        <td
          class="pack-item tooltip"
          onclick='useConsumable("rawChicken")'
          id="rawChicken"
        ></td>
        <td class="pack-item tooltip" onclick='useConsumable("")'>TBD</td>
        <td
          class="pack-item tooltip"
          onclick='useConsumable("bomb")'
          id="bomb"
        ></td>
      </tr>
    </table>
  </div>
</template>
