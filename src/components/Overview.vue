<script setup lang="ts">
  import { computed, toRefs } from "@vue/reactivity";
  import parser from "cron-parser";
  import { coins, currency } from "../app/store";
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
</script>

<template>
  <div class="px-4 pb-4 pt-8 flex flex-col space-y-2">
    <p class="text-xl">Overview</p>
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
