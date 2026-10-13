
export default function formatCurrency(
  amount,
  currency = "USD",
  locale = "en-US"
) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(0);
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
}