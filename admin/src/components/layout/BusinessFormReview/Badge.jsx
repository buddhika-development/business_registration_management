export const Badge = ({ children, tone = "warn", className = "" }) => {
  const cn =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : tone === "error"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cn} ${className}`}>
      {children}
    </span>
  );
};