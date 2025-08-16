import SecondaryHeader from "@/components/layout/SecondaryHeader";

export default function SecondaryLayout({ children }) {
  return (
    <>
      <SecondaryHeader />
      <div className="body-content">{children}</div>
    </>
  );
}
