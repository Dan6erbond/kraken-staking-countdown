<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { currency } from "./app/store";
  import { stakingCoins } from "./assets/staking-coins";
  import CoinCard from "./components/CoinCard.vue";
  import CurrencySelector from "./components/CurrencySelector.vue";
  import Header from "./components/Header.vue";
  import {
    useCoinsList,
    useCoinsMarket,
    useSupportedVsCurrencies,
  } from "./hooks/coingecko";
  import Overview from "./components/Overview.vue";

  const { coins } = useCoinsList();
  const ids = computed(
    () =>
      coins.value &&
      coins.value
        .filter(
          ({ symbol }) =>
            stakingCoins
              .map(({ symbol }) => symbol.toLowerCase())
              .indexOf(symbol) !== -1,
        )
        .map(({ id }) => id),
  );
  const { coins: market } = useCoinsMarket({
    vsCurrency: currency,
    ids,
  });

  const coinsList = computed(
    () =>
      market.value &&
      stakingCoins.map((coin) => ({
        ...coin,
        market: market.value!.find(
          ({ symbol }) => symbol.toLowerCase() === coin.symbol.toLowerCase(),
        ),
      })),
  );

  const { vsCurrencies } = useSupportedVsCurrencies();

  onMounted(() => {
    document.body.classList.add("dark");
  });
</script>

<template>
  <div
    id="app"
    class="
      font-sans
      bg-gradient-to-br
      dark:from-dark-blue-800 dark:to-dark-blue-900
      min-h-screen
      dark:text-white
    "
  >
    <Header />
    <CurrencySelector v-if="vsCurrencies" :currencies="vsCurrencies" />
    <Overview v-if="market" :coinsMarket="market" />
    <div v-if="coinsList" class="flex flex-col p-4 space-y-6">
      <CoinCard
        v-for="coin in coinsList"
        :key="coin.symbol"
        :coin="coin"
        :coinMarket="coin.market!"
      />
    </div>
  </div>
</template>
