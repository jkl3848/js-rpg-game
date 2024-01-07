<script setup>
import { useMainStore } from "../../stores/mainStore";

const store = useMainStore();
</script>

<template>
  <div>
    {{ store.gameMessage }}
  </div>
</template>
