export const Row = ({ label, value }) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  ) return null;

  return (
    <>
      <p className="base-text font-semibold">{label}</p>
      <p className="base-text break-words">{value}</p>
    </>
  );
};
