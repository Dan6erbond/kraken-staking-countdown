<script setup lang="ts">
  import parser from "cron-parser";
  import { computed, onMounted, ref, toRefs, watch } from "vue";
  import { coins, currency, favoriteCoins } from "../app/store";
  import { StakingCoin } from "../assets/staking-coins";
  import { CoinMarket } from "../hooks/coingecko";
  import { getCoinAverageRpy, getCoinYearlyPayouts } from "../utils/coins";
  import { formatAsCurrency, formatTime } from "../utils/formatting";

  // eslint-disable-next-line no-undef
  const props = defineProps<{
    coin: StakingCoin;
    coinMarket: CoinMarket;
  }>();

  const { coin } = toRefs(props);
  const isFavorite = computed(
    () => favoriteCoins.value.indexOf(coin.value.symbol) !== -1,
  );

  const stakingAmount = ref<number>();

  watch(
    [coin, coins],
    ([coin, coins]) => {
      if (coins) {
        const stakingCoin = coins.find(
          (c) => c.symbol.toLowerCase() === coin.symbol.toLowerCase(),
        );
        if (stakingCoin) {
          stakingAmount.value = stakingCoin.stakedAmount;
        }
      }
    },
    { immediate: true },
  );

  watch(stakingAmount, (stakingAmount) => {
    if (stakingAmount === undefined) return;
    if (
      coins.value.find(
        (c) => c.symbol.toLowerCase() === coin.value.symbol.toLowerCase(),
      )
    ) {
      coins.value = coins.value.map((c) => {
        if (c.symbol.toLowerCase() === coin.value.symbol.toLowerCase()) {
          return {
            ...c,
            stakedAmount: stakingAmount,
          };
        }
        return c;
      });
    } else {
      coins.value = [
        ...coins.value,
        { symbol: coin.value.symbol, stakedAmount: stakingAmount },
      ];
    }
  });

  const yearlyPayouts = computed(() => getCoinYearlyPayouts(coin.value).length);
  const averageRpy = computed(() => getCoinAverageRpy(coin.value));

  const nextPayout = computed(() =>
    parser
      .parseExpression(coin.value.rewardSchedule.cron, {
        tz: "UTC",
      })
      .next()
      .toDate(),
  );

  const timeToNextPayout = ref(0);

  onMounted(() => {
    setInterval(() => {
      timeToNextPayout.value =
        nextPayout.value.getTime() - new Date().getTime();
    }, 1000);
  });
</script>

<template>
  <div
    class="
      flex flex-col
      md:flex-row
      p-4
      bg-gradient-to-br
      from-dark-blue-800
      to-dark-blue-900
      border-dark-blue-600 border
      rounded
      shadow-lg
      md:items-center
      space-y-8
      md:space-y-0 md:space-x-4
    "
  >
    <div class="flex justify-end md:justify-start -mb-6 md:mb-0">
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          v-if="!isFavorite"
          @click="favoriteCoins = [...favoriteCoins, coin.symbol]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          v-else
          @click="
            favoriteCoins = favoriteCoins.filter(
              (symbol) => symbol !== coin.symbol,
            )
          "
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </button>
    </div>
    <div
      class="
        flex
        md:flex-col
        justify-between
        md:space-y-4
        items-center
        md:items-stretch
      "
    >
      <div class="flex space-x-4 items-center">
        <div>
          <img :src="coinMarket.image" class="h-16 md:h-8" />
        </div>
        <div class="flex flex-col">
          <span class="text-lg md:text-base text-gray-400">{{
            coinMarket.symbol.toUpperCase()
          }}</span>
          <span class="text-lg md:text-base">{{ coinMarket.name }}</span>
        </div>
      </div>
      <div class="flex flex-col">
        <span class="text-gray-500 text-sm">Next Payout</span>
        <span>{{ formatTime(timeToNextPayout) }}</span>
      </div>
    </div>
    <div
      class="hidden md:block self-stretch border-l border-dark-blue-700"
    ></div>
    <div
      class="
        flex flex-col
        self-stretch
        md:self-auto
        space-y-2
        md:items-end
        justify-center
        md:pr-4
      "
    >
      <span class="text-sm text-gray-300">Enter your Staking Amount</span>
      <div
        class="
          bg-dark-blue-800
          rounded
          py-2
          px-4
          border border-dark-blue-600
          focus-within:ring focus-within:border-dark-blue-700
          flex
          items-center
          space-x-2
        "
      >
        <span class="flex-shrink-0">{{ coinMarket.symbol.toUpperCase() }}</span>
        <div class="self-stretch border-r border-dark-blue-500"></div>
        <input
          class="
            focus:outline-none
            focus:border-transparent
            focus:shadow-none
            focus:ring-0
            bg-transparent
            border-transparent
            p-0
            flex-grow flex-shrink
            box-border
            w-6
            md:w-auto
          "
          v-model="stakingAmount"
          type="number"
          pattern="[0-9]*"
          novalidate
        />
        <button
          class="text-dark-blue-400 flex-shrink-0"
          @click="stakingAmount = 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <span class="text-sm text-gray-300 text-right">
        <span class="font-bold">Expected Payout</span>
        {{
          stakingAmount
            ? formatAsCurrency((stakingAmount * averageRpy) / yearlyPayouts)
            : "-"
        }}
        {{ coinMarket.symbol.toUpperCase() }} /
        {{
          stakingAmount
            ? formatAsCurrency(
                ((stakingAmount * averageRpy) / yearlyPayouts) *
                  coinMarket.current_price,
              )
            : "-"
        }}
        {{ currency.toUpperCase() }}
      </span>
      <span class="text-sm text-gray-300 text-right">
        <span class="font-bold">Yearly</span>
        {{ stakingAmount ? formatAsCurrency(stakingAmount * averageRpy) : "-" }}
        {{ coinMarket.symbol.toUpperCase() }} /
        {{
          stakingAmount
            ? formatAsCurrency(
                stakingAmount * averageRpy * coinMarket.current_price,
              )
            : "-"
        }}
        {{ currency.toUpperCase() }}
      </span>
    </div>
    <div
      class="hidden md:block self-stretch border-r border-dark-blue-700"
    ></div>
    <div class="flex flex-1 flex-col flex-shrink-0 text-sm space-y-2">
      <div class="flex flex-shrink-0 justify-between items-center">
        <span class="text-gray-300 text-xs">Rewards Schedule</span>
        <span>
          {{ coin.rewardSchedule.text }}
        </span>
      </div>
      <hr class="border-gray-600" />
      <div class="flex flex-shrink-0 justify-between items-center">
        <span class="text-gray-300 text-xs">Next Payout</span>
        <span>
          {{ nextPayout.toLocaleString() }}
        </span>
      </div>
      <hr class="border-gray-600" />
      <div class="flex flex-shrink-0 justify-between items-center">
        <span class="text-gray-300 text-xs">Rewards per Year (RPY)</span>
        <span>
          {{
            Array.isArray(coin.rpy)
              ? `${(coin.rpy[0] * 100).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })} - ${(coin.rpy[1] * 100).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}%`
              : `${(coin.rpy * 100).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}%`
          }}
        </span>
      </div>
    </div>
  </div>
</template>
