export const validityLabel = (v) => {
  if (v === true) return 'Valid';
  if (v === false) return 'Invalid';
  return 'Unknown';
};

export const validityStyles = (v) => {
  if (v === true) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (v === false) return 'bg-red-100 text-red-700 border-red-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};