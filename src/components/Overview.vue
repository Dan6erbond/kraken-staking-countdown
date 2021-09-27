<script setup lang="ts">
  import { computed, toRefs } from "@vue/reactivity";
  import parser from "cron-parser";
  import { ref } from "vue";
  import { coins, currency, favoriteCoins } from "../app/store";
  import { stakingCoins } from "../assets/staking-coins";
  import { CoinMarket } from "../hooks/coingecko";
  import { formatAsCurrency } from "../utils/formatting";

  // eslint-disable-next-line no-undef
  const props = defineProps<{ coinsMarket: CoinMarket[] }>();
  const { coinsMarket } = toRefs(props);

  const availableCoins = computed(() =>
    stakingCoins.filter(
      (coin) =>
        coins.value
          .map(({ symbol }) => symbol.toLowerCase())
          .indexOf(coin.symbol.toLowerCase()) !== -1,
    ),
  );

  const nextCoin = computed(() => {
    if (availableCoins.value.length) {
      const nextCoin = availableCoins.value.reduce((prevCoin, currCoin) => {
        const next = parser
          .parseExpression(currCoin.rewardSchedule.cron)
          .next();
        const prevCoinNext = parser
          .parseExpression(prevCoin.rewardSchedule.cron)
          .next();
        if (next.getTime() < prevCoinNext.getTime()) {
          return currCoin;
        }
        return prevCoin;
      });
      return {
        ...nextCoin,
        market: coinsMarket.value.find(
          ({ symbol }) =>
            symbol.toLowerCase() === nextCoin.symbol.toLowerCase(),
        ),
      };
    }
  });

  const yearlyPayout = computed(() =>
    availableCoins.value.reduce((payout, currCoin) => {
      const marketCoin = coinsMarket.value.find(
        ({ symbol }) => symbol.toLowerCase() === currCoin.symbol.toLowerCase(),
      );
      const holderCoin = coins.value.find(
        ({ symbol }) => symbol.toLowerCase() === currCoin.symbol.toLowerCase(),
      );
      if (marketCoin && holderCoin) {
        const rpy = Array.isArray(currCoin.rpy)
          ? currCoin.rpy.reduce((a, b) => a + b, 0) / currCoin.rpy.length
          : currCoin.rpy;
        return (
          payout + marketCoin.current_price * rpy * holderCoin.stakedAmount
        );
      }
      return payout;
    }, 0),
  );

  const downloadData = computed(() => {
    const data = {
      coins: coins.value,
      currency: currency.value,
      favoriteCoins: favoriteCoins.value,
    };
    return `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2),
    )}`;
  });

  const importFilePicker = ref<HTMLInputElement>();

  function clickImportFile() {
    importFilePicker.value && importFilePicker.value.click();
  }

  const loadingImportFile = ref(false);

  function loadImportFile(file: File) {
    loadingImportFile.value = true;
    console.log(file);
    file.text().then((text) => {
      const data = JSON.parse(text);

      if (data.coins) coins.value = data.coins;
      if (data.currency) currency.value = data.currency;
      if (data.favoriteCoins) favoriteCoins.value = data.favoriteCoins;

      loadingImportFile.value = false;
    });
  }

  function importFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    files?.length && loadImportFile(files[0]);
  }

  function dropImportFile(event: DragEvent) {
    console.log(event);
    event.preventDefault();
    if (event.dataTransfer?.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const item = event.dataTransfer.items[i];
        if (item.kind === "file") {
          const file = item.getAsFile();
          file && loadImportFile(file);
          break;
        }
      }
    } else if (event.dataTransfer?.files.length) {
      loadImportFile(event.dataTransfer.files[1]);
    }
  }
</script>

<template>
  <div class="px-4 pb-4 pt-8 flex flex-col space-y-2">
    <div class="flex space-x-2">
      <p class="text-xl p-0">Overview</p>
      <div class="flex-grow"></div>
      <a
        :href="downloadData"
        class="
          text-gray-600
          border border-gray-600
          text-sm
          rounded
          shadow
          p-2
          flex
          items-center
          space-x-2
        "
        download="kraken_staking_rewards.json"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
          />
        </svg>
        <span>Export</span>
      </a>
      <input
        type="file"
        accept=".json"
        ref="importFilePicker"
        class="hidden"
        @change="importFile"
      />
      <button
        class="
          text-gray-600
          border border-gray-600
          text-sm
          rounded
          shadow
          p-2
          flex
          items-center
          space-x-2
        "
        @click="clickImportFile"
        @drop="dropImportFile"
        @dragenter.prevent
        @dragover.prevent
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
          />
        </svg>
        <span>Import</span>
      </button>
    </div>
    <div class="flex justify-evenly">
      <div class="flex flex-1 flex-col space-y-1">
        <p class="text-sm text-gray-500">Next Payout</p>
        <div class="flex space-x-2 items-center" v-if="nextCoin">
          <img :src="nextCoin.market?.image" alt="" class="h-5 w-5" />
          <span>
            {{
              parser
                .parseExpression(nextCoin.rewardSchedule.cron)
                .next()
                .toDate()
                .toLocaleString()
            }}
          </span>
          <span class="self-start text-xs text-gray-400">
            {{ nextCoin.market?.symbol.toUpperCase() }}
          </span>
        </div>
        <p v-else>-</p>
      </div>
      <div class="flex flex-1 flex-col space-y-1">
        <p class="text-sm text-gray-500">Yearly Payout</p>
        <div class="flex space-x-2 items-center" v-if="yearlyPayout">
          <span>
            {{ formatAsCurrency(yearlyPayout) }}
          </span>
          <span class="self-start text-xs text-gray-400">
            {{ currency.toUpperCase() }}
          </span>
        </div>
        <p v-else>-</p>
      </div>
    </div>
  </div>
</template>
