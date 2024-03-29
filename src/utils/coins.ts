import { StakingCoin } from "../assets/staking-coins";
import parser from "cron-parser";

export const calculateStakingRewards = (
  coin: StakingCoin,
  stakedAmount: number,
  since: Date,
) => {
  const res = parser.parseExpression(coin.rewardSchedule.cron, {
    currentDate: since,
    endDate: new Date(),
  });
  let newStakedAmount = stakedAmount;
  while (res.hasNext()) {
    newStakedAmount +=
      (getCoinAverageRpy(coin) * newStakedAmount) /
      getCoinYearlyPayouts(coin).length;
    res.next();
  }
  return newStakedAmount - stakedAmount;
};

export const getCoinYearlyPayouts = ({ rewardSchedule }: StakingCoin) => {
  const currentYear = new Date().getFullYear();
  const res = parser.parseExpression(rewardSchedule.cron, {
    currentDate: new Date(currentYear, 0, 1),
    tz: "UTC",
  });
  let next = res.next();
  const yearlyPayouts = [];
  while (res.hasNext() && next.getFullYear() < currentYear + 1) {
    yearlyPayouts.push(next);
    next = res.next();
  }
  return yearlyPayouts;
};

export const getCoinAverageRpy = ({ rpy }: StakingCoin) => {
  return Array.isArray(rpy) ? rpy.reduce((a, b) => a + b, 0) / rpy.length : rpy;
};
