import { ref, watch } from "vue";

export const currency = ref(localStorage.getItem("currency") ?? "usd");
export const favoriteCoins = ref<string[]>(
  localStorage.getItem("favoriteCoins")
    ? JSON.parse(localStorage.getItem("favoriteCoins")!)
    : [],
);

interface Coin {
  symbol: string;
  stakedAmount: number;
}

export const coins = ref<Coin[]>(
  localStorage.getItem("coins")
    ? JSON.parse(localStorage.getItem("coins")!)
    : [],
);

watch([currency, coins, favoriteCoins], ([currency, coins, favoriteCoins]) => {
  localStorage.setItem("currency", currency);
  localStorage.setItem("coins", JSON.stringify(coins));
  localStorage.setItem("favoriteCoins", JSON.stringify(favoriteCoins));
});
