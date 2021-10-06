interface Wallet {
  currency: string;
  walletAddress: string;
  icon: string;
  walletAddressColor: string;
  qrCodeLogoImage?: string;
}

export const wallets: Wallet[] = [
  {
    currency: "BTC",
    walletAddress: "bc1qzevkywtd6p0fupn08hlqp4d6sfuplmvfscwf05",
    icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    walletAddressColor: "#9CA3AF",
  },
  {
    currency: "ETH",
    walletAddress: "0x31cD9e4d146B926beB5C1D6BAB86B1cA7a89F828",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    walletAddressColor: "#9CA3AF",
  },
  {
    currency: "ADA",
    walletAddress:
      "addr1q9s34mhdk9w32m6w7yme8ejprqhgsz750zv27y3e2hfcrcnprthwmv2az4h5aufhj0nyzxpw3q9ag7yc4ufrj4wns83qkadsdv",
    icon: "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
    qrCodeLogoImage:
      "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
    walletAddressColor: "#9CA3AF",
  },
  {
    currency: "SOL",
    walletAddress: "5ENP1d54bKDZwL1jyw7qrZv9tVxnxpKkkeYApMQMZ6xD",
    icon: "https://assets.coingecko.com/coins/images/4128/large/coinmarketcap-solana-200.png?1616489452",
    walletAddressColor: "#9CA3AF",
  },
  {
    currency: "DOT",
    walletAddress: "14oVXWRFR9bU5keVmbxs3mEJr9DYSi1an4GdTt1HhYdAMqpy",
    icon: "https://assets.coingecko.com/coins/images/12171/large/aJGBjJFU_400x400.jpg?1597804776",
    walletAddressColor: "#9CA3AF",
  },
  {
    currency: "ATOM",
    walletAddress: "cosmos1e4rz6y3ah89qfltgcftu3ry89xryn60ztf5ken",
    icon: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960",
    walletAddressColor: "#9CA3AF",
  },
  {
    currency: "ALGO",
    walletAddress: "ZVHQ7UXHMQP6A5LX5KNHWHWXJNQEF6WRHWUE2N3OO4RUFIXHQIMUXLVCE4",
    icon: "https://assets.coingecko.com/coins/images/4380/large/download.png?1547039725",
    walletAddressColor: "#9CA3AF",
  },
  {
    currency: "XMR",
    walletAddress:
      "4BF4HPudpdyXig9KSm6PbhYZTUKXvMVJDfNSR2rVPmRqWbETtzvcPS6Ram9BW9VC7d5ZLMTur3pq9cTu8qUyiWnL1FENRrb",
    icon: "https://assets.coingecko.com/coins/images/69/small/monero_logo.png?1547033729",
    walletAddressColor: "#9CA3AF",
  },
  {
    currency: "NANO",
    walletAddress:
      "nano_14kk4u6tpka567szjs98ng1zkfnjpq7cbprxiatd3dycs9m1num3cu83osba",
    icon: "https://assets.coingecko.com/coins/images/756/small/nano-coin-logo.png?1547034501",
    walletAddressColor: "#9CA3AF",
  },
];
