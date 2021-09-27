import { ref, watch } from "vue";

export const currency = ref(localStorage.getItem("currency") ?? "usd");

interface Coin {
  symbol: string;
  stakedAmount: number;
}

export const coins = ref<Coin[]>(
  localStorage.getItem("coins")
    ? JSON.parse(localStorage.getItem("coins")!)
    : [],
);

watch([currency, coins], ([currency, coins]) => {
  localStorage.setItem("currency", currency);
  localStorage.setItem("coins", JSON.stringify(coins));
});
