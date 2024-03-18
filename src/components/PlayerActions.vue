<script setup>
import { useCombatStore } from "../../stores/combat";
import { useMainStore } from "../../stores/mainStore";
import heroData from "../../js/hero";

const store = useMainStore();
const combat = useCombatStore();
const heroInfo = heroData();

function playerAction(actionType) {
  if (actionType === "attack") {
    combat.attack(store.hero, combat.playerTarget);
  }

  if (actionType === "2") {
    combat.secondAction(store.hero, combat.playerTarget);
  }

  combat.playerPostAction();
  combat.playerTurn = false;
}
</script>

<template>
  <!-- Bottom HUD -->
  <div class="hud" id="action-buttons">
    <div class="tooltip" v-if="combat.inCombat">
      <button
        class="action-button"
        :class="!combat.playerTurn ? 'disabled' : ''"
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
        {{
          heroInfo.classes.find((item) => item.name === store.hero.class)
            .secondAbility.name
        }}
      </button>
    </div>
    <div class="tooltip" v-if="combat.inCombat">
      <button
        class="action-button"
        :class="!combat.playerTurn ? 'disabled' : ''"
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
        src="../../assets/icons/backpack_icon.png"
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

  width: 120px;
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
  background-color: rgb(110, 14, 14);
}

#backpack {
  position: absolute;
  left: 970px;
}

.backpack-icon {
  cursor: pointer;
}
</style>
