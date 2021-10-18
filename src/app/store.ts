import { ref, watch } from "vue";
import { stakingCoins } from "../assets/staking-coins";
import { calculateStakingRewards } from "../utils/coins";

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

const lastVisit = localStorage.getItem("lastVisit");
export const updatedRewards = ref(false);
if (lastVisit) {
  for (const coin of coins.value) {
    const stakingCoin = stakingCoins.find(
      ({ symbol }) => symbol === coin.symbol,
    )!;
    const rewards = calculateStakingRewards(
      stakingCoin,
      coin.stakedAmount,
      new Date(lastVisit),
    );
    console.log(
      `[Store] Calculated staking rewards for ${coin.symbol}: ${rewards}`,
    );
    if (rewards > 0) {
      updatedRewards.value = true;
      coins.value = coins.value.map((c) =>
        c.symbol === coin.symbol
          ? { ...c, stakedAmount: c.stakedAmount + rewards }
          : c,
      );
    }
  }
  console.log("[Store] Updated staking rewards since last visit.");
}
localStorage.setItem("lastVisit", new Date().toISOString());
