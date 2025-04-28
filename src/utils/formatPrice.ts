export function formatPrice(value: number, currency: string): string {
  const formatter = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(value).replace(/\s+/g, " ");
}
