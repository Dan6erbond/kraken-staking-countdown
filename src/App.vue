<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { currency, favoriteCoins } from "./app/store";
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
  import { wallets } from "./assets/wallets";

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
      stakingCoins
        .map((coin) => ({
          ...coin,
          market: market.value!.find(
            ({ symbol }) => symbol.toLowerCase() === coin.symbol.toLowerCase(),
          )!,
        }))
        .sort((coin) =>
          favoriteCoins.value.indexOf(coin.symbol) === -1 ? 1 : -1,
        ),
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
    <div v-else class="flex space-x-2 overflow-auto m-4 pb-4">
      <div
        class="
          border border-dark-blue-600
          shadow
          rounded-md
          p-2
          flex
          items-center
          justify-center
        "
        v-for="i in 20"
        :key="i"
      >
        <div class="h-3 bg-dark-blue-500 rounded w-6"></div>
      </div>
    </div>
    <Overview v-if="market" :coinsMarket="market" />
    <div v-else class="p-4 flex space-x-6">
      <div
        class="border border-dark-blue-600 shadow rounded-md p-4"
        v-for="i in 2"
        :key="i"
      >
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-dark-blue-500 h-12 w-12"></div>
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-dark-blue-500 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-dark-blue-500 rounded"></div>
              <div class="h-4 bg-dark-blue-500 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="coinsList" class="flex flex-col p-4 space-y-6">
      <CoinCard
        v-for="coin in coinsList"
        :key="coin.symbol"
        :coin="coin"
        :coinMarket="coin.market"
      />
    </div>
    <div v-else class="p-4 flex flex-col space-y-6">
      <div
        class="border border-dark-blue-600 shadow rounded-md p-4"
        v-for="i in 10"
        :key="i"
      >
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-dark-blue-500 h-12 w-12"></div>
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-dark-blue-500 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-dark-blue-500 rounded"></div>
              <div class="h-4 bg-dark-blue-500 rounded"></div>
              <div class="h-4 bg-dark-blue-500 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col space-y-4 p-8 items-center">
      <div class="flex space-x-4">
        <a href="https://github.com/Dan6erbond/kraken-staking-countdown">
          <svg
            viewBox="0 0 128 128"
            class="h-6 w-6 text-gray-400"
            fill="currentColor"
          >
            <g>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
              ></path>
              <path
                d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"
              ></path>
            </g>
          </svg>
        </a>
        <a href="https://www.reddit.com/user/Dan6erbond">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-400"
            fill="currentColor"
          >
            <title>Reddit</title>
            <path
              d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
            />
          </svg>
        </a>
        <a href="https://ravianand.web.app/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </a>
      </div>
      <div class="flex space-x-4">
        <a
          href="https://github.com/Dan6erbond/kraken-staking-countdown/issues/new"
          class="
            flex
            space-x-2
            p-2
            shadow
            rounded
            bg-dark-blue-600
            text-dark-blue-900
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Submit a feature request!</span>
        </a>
      </div>
      <div class="flex flex-col space-y-2 w-full items-stretch pt-2">
        <div class="flex items-center space-x-2 text-2xl font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>Support Me</span>
        </div>

        <p>
          Kraken Staking Rewards is built by a crypto enthusiast just like you!
        </p>
        <p class="pb-2 text-sm text-gray-400">
          Support me by donating some crypto to help cover development and
          project-related costs.
        </p>

        <crypto-wallet-widget
          v-for="wallet in wallets"
          :key="wallet.currency"
          :currency="wallet.currency"
          :wallet-address="wallet.walletAddress"
          :icon="wallet.icon"
          :qr-code-logo-image="wallet.qrCodeLogoImage"
          :wallet-address-color="wallet.walletAddressColor"
        />

        <p class="text-sm text-gray-400 text-right">
          Crypto Wallet Widget built by Dan6erbond.
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
  crypto-wallet-widget {
    @apply bg-dark-blue-800 text-sm p-2 rounded;
  }
</style>
