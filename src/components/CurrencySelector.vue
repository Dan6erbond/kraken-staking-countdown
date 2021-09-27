<script setup lang="ts">
  import { computed, toRefs } from "@vue/reactivity";
  import { currency } from "../app/store";

  // eslint-disable-next-line no-undef
  const props = defineProps<{ currencies: string[] }>();
  const { currencies: currs } = toRefs(props);

  const currencies = computed(
    () =>
      currs.value &&
      [...currs.value].sort((currency1, currency2) =>
        currency.value.toLowerCase() === currency1.toLowerCase()
          ? -1
          : currency1 > currency2
          ? 1
          : 0,
      ),
  );
</script>

<template>
  <div class="flex flex-col px-4 pt-4 space-y-4">
    <span>Currency</span>
    <div class="flex space-x-2 overflow-auto pb-4">
      <div
        v-for="curr in currencies"
        :key="curr"
        :class="[
          'bg-dark-blue-700',
          'hover:bg-dark-blue-600',
          'rounded',
          'shadow',
          'px-2',
          'py-1',
          'cursor-pointer',
          curr === currency && ['bg-dark-blue-900', 'hover:bg-dark-blue-800'],
        ]"
        @click="currency = curr"
      >
        {{ curr.toUpperCase() }}
      </div>
    </div>
  </div>
</template>
