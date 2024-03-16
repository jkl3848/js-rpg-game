<script setup>
import { useCombatStore } from "../../stores/combat";
import { useMainStore } from "../../stores/mainStore";

const store = useMainStore();
const combat = useCombatStore();

function playerAction(actionType) {
  if (actionType === "attack") {
    combat.attack(store.hero, combat.playerTarget);
  }

  combat.playerPostAction();
}
</script>

<template>
  <!-- Bottom HUD -->
  <div class="hud" id="action-buttons">
    <div class="tooltip" v-if="combat.inCombat">
      <button
        class="action-button"
        id="attackButton"
        :disabled="!combat.playerTurn"
        @click="playerAction('attack')"
      >
        Attack
      </button>
    </div>
    <div class="tooltip" v-if="combat.inCombat">
      <button
        class="action-button"
        :class="
          combat.secondCooldown > 0 || !combat.playerTurn ? 'disabled' : ''
        "
        id="2ndActionButton"
        :disabled="combat.secondCooldown > 0 || !combat.playerTurn"
        @click="playerAction('2')"
      >
        2nd Action
      </button>
    </div>
    <div class="tooltip" v-if="combat.inCombat">
      <button
        class="action-button"
        id="fleeButton"
        :disabled="!combat.playerTurn"
        @click="playerAction('flee')"
      >
        Flee
      </button>
    </div>
    <div></div>
    <div class="tooltip" id="backpack">
      <img
        src="../../public/assets/icons/backpack_icon.png"
        class="backpack-icon"
        @click="
          store.elementStates.backpackOpen = !store.elementStates.backpackOpen
        "
      />
    </div>
  </div>
</template>

<style scoped>
.hud {
  width: 1024px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  background-color: gray;
  height: 48px;

  padding: auto;
}

.action-button {
  background-color: rgb(211, 16, 16);
  color: white;

  width: 80px;
  height: 30px;

  margin: 8px;

  border: none;
  border-radius: 15px;
  cursor: pointer;
}

.action-button:hover {
  background-color: rgb(237, 18, 18);
}

.action-button.disabled {
  opacity: 0.7;
}

#backpack {
  position: absolute;
  left: 970px;
}

.backpack-icon {
  cursor: pointer;
}
</style>
