export const formatDateTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");