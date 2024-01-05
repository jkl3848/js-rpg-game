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
            <td onclick="subAttrValue('maxHP')">
              <button class="point-change-button">-</button>
            </td>
            <td class="point-value" id="point-maxHP-value">7</td>
            <td onclick="addAttrValue('maxHP')">
              <button class="point-change-button">+</button>
            </td>
          </tr>
          <tr class="point-section">
            <td class="point-attr">ATK</td>
            <td onclick="subAttrValue('attack')">
              <button class="point-change-button">-</button>
            </td>
            <td class="point-value" id="point-attack-value"></td>
            <td onclick="addAttrValue('attack')">
              <button class="point-change-button">+</button>
            </td>
          </tr>

          <tr class="point-section">
            <td class="point-attr">DEF</td>
            <td onclick="subAttrValue('defense')">
              <button class="point-change-button">-</button>
            </td>
            <td class="point-value" id="point-defense-value"></td>
            <td onclick="addAttrValue('defense')">
              <button class="point-change-button">+</button>
            </td>
          </tr>

          <tr class="point-section">
            <td class="point-attr">SPD</td>
            <td onclick="subAttrValue('speed')">
              <button class="point-change-button">-</button>
            </td>
            <td class="point-value" id="point-speed-value"></td>
            <td onclick="addAttrValue('speed')">
              <button class="point-change-button">+</button>
            </td>
          </tr>
          <tr class="point-section">
            <td class="point-attr">CRT</td>
            <td onclick="subAttrValue('critChance')">
              <button class="point-change-button">-</button>
            </td>
            <td class="point-value" id="point-critChance-value"></td>
            <td onclick="addAttrValue('critChance')">
              <button class="point-change-button">+</button>
            </td>
          </tr>
        </table>
      </div>
      <button
        class="primary-button"
        onclick="
document.getElementById('level-up-button').disabled = true;clearAllOverlays()"
        id="level-up-button"
        disabled
      >
        Level Up
      </button>
    </div>
  </div>
</template>
