export const Card = ({ title, children }) => (
  <section>
    <h3 className="mb-3 text-sm font-semibold tracking-wide base-text">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 p-4 rounded-xl border border-slate-200 bg-white">
      {children}
    </div>
  </section>
);

export const Row = ({ label, value }) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  )
    return null;
  return (
    <>
      <p className="base-text">{label}</p>
      <p className="base-text font-medium break-words">{value}</p>
    </>
  );
};
