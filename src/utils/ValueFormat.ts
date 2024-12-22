export const ByteUnits = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'];

export const formatDecimal = (value: number) => {
  return parseFloat((Math.round(value * 100) / 100) as any).toFixed(2);
};

export const formatAverage = (countFrom: number, total: number) => {
  return (total === 0 ? 0 : countFrom / total).toFixed(2);
};

export const formatPercentage = (countFrom: number, total: number) => {
  return `${(parseFloat(formatAverage(countFrom, total)) * 100).toFixed(2)} %`;
};
