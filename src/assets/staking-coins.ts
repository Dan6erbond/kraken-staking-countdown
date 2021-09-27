export interface StakingCoin {
  symbol: string;
  rpy: number | [number, number];
  stakeMinimum: number;
  rewardSchedule: { text: string; cron: string };
}

// Data from https://support.kraken.com/hc/en-us/articles/360037682011-Overview-of-On-chain-staking-on-Kraken

export const stakingCoins: StakingCoin[] = [
  {
    symbol: "ADA",
    rpy: [0.04, 0.06],
    stakeMinimum: 0.000001,
    rewardSchedule: {
      text: "Monday Starting at 01:30 UTC",
      cron: "30 1 * * 1",
    },
  },
  {
    symbol: "ATOM",
    rpy: 0.07,
    stakeMinimum: 0.2,
    rewardSchedule: {
      text: "Sunday & Wednesday Starting at 01:00 UTC",
      cron: "0 1 * * 0,3",
    },
  },
  {
    symbol: "ETH",
    rpy: [0.04, 0.07],
    stakeMinimum: 0.00001,
    rewardSchedule: {
      text: "Sunday Starting at 01:30 UTC",
      cron: "30 1 * * 0",
    },
  },
  {
    symbol: "FLOW",
    rpy: 0.046,
    stakeMinimum: 0.2,
    rewardSchedule: {
      text: "Tuesday Starting at 01:30 UTC",
      cron: "30 1 * * 2",
    },
  },
  {
    symbol: "KAVA",
    rpy: 0.2,
    stakeMinimum: 0.2,
    rewardSchedule: {
      text: "Sunday & Wednesday Starting at 02:00 UTC",
      cron: "0 2 * * 0,3",
    },
  },
  {
    symbol: "KSM",
    rpy: 0.12,
    stakeMinimum: 0.2,
    rewardSchedule: {
      text: "Wednesday & Saturday Starting at 01:00 UTC",
      cron: "0 1 * * 6,3",
    },
  },
  {
    symbol: "DOT",
    rpy: 0.12,
    stakeMinimum: 0.2,
    rewardSchedule: {
      text: "Tuesday & Friday Starting at 01:00 UTC",
      cron: "0 1 * * 2,5",
    },
  },
  {
    symbol: "SOL",
    rpy: 0.065,
    stakeMinimum: 0.000001,
    rewardSchedule: {
      text: "Saturday Starting at 01:00 UTC",
      cron: "0 1 * * 6",
    },
  },
  {
    symbol: "XTZ",
    rpy: 0.055,
    stakeMinimum: 0.000001,
    rewardSchedule: {
      text: "Monday & Thursday Starting at 01:00 UTC",
      cron: "0 1 * * 1,4",
    },
  },
];
