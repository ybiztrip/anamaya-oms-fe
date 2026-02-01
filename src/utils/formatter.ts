export const formatDuration = (minsStr?: string) => {
  const mins = Number(minsStr ?? 0);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const formatIDR = (amountStr?: string) => {
  const n = Math.round(Number(amountStr ?? 0));
  return new Intl.NumberFormat('id-ID').format(n);
};
