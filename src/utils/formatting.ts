export const formatAsCurrency = (value: number) => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value > 0.1 ? 2 : 5,
    maximumFractionDigits: value > 0.1 ? 2 : 5,
  });
};

export const formatTime = (ms: number) => {
  const days = Math.floor(ms / 1000 / 60 / 60 / 24);
  let rest = ms - days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(rest / 1000 / 60 / 60);
  rest = rest - hours * 1000 * 60 * 60;
  const minutes = Math.floor(rest / 1000 / 60);
  rest = rest - minutes * 1000 * 60;
  const seconds = Math.floor(rest / 1000);

  return `${days.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}:${hours.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}:${minutes.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}:${seconds.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;
};
