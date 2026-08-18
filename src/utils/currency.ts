export const formatRupiah = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const USD_TO_IDR = 16_000;

export const usdToRupiah = (usd: number): string =>
  formatRupiah(Math.round(usd * USD_TO_IDR));
