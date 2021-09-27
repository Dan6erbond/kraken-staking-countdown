import { Ref, ref, watch } from "vue";

// Generated by https://quicktype.io

export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

export const useCoinsList = () => {
  const coins = ref<Coin[]>();

  fetch("https://api.coingecko.com/api/v3/coins/list").then((res) => {
    res.json().then((data) => {
      coins.value = data;
    });
  });

  return { coins };
};

interface UseCoinsMarketArgs {
  vsCurrency: Ref<string>;
  ids: Ref<string[] | undefined>;
}

// Generated by https://quicktype.io

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null;
  last_updated: string;
}

export const useCoinsMarket = ({ vsCurrency, ids }: UseCoinsMarketArgs) => {
  const coins = ref<CoinMarket[]>();

  watch([vsCurrency, ids], ([vsCurrency, ids]) => {
    if (!vsCurrency || !ids) return;

    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&ids=${ids.join(
        ",",
      )}`,
    )
      .then((res) => {
        res.json().then((data) => {
          coins.value = data;
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return { coins };
};