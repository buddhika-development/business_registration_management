import ContactTitle from "@/components/ui/Title/ContactTitle";

export default function ContactHeaderSection() {
  return (
    <ContactTitle as="hgroup" className="text-2xl md:text-3xl font-bold">
      <h3 className="text-2xl md:text-3xl font-bold">
        We are here to help you.
      </h3>
      <h3 className="text-2xl md:text-3xl font-bold">
        Reach out for{" "}
        <span className="text-primary">anything about </span>
      </h3>
      <h3 className="text-2xl md:text-3xl font-bold">
      <span className="text-primary">Business Registration</span>
      </h3>
    </ContactTitle>
  );
}
