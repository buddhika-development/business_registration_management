import HighlightTitle from "@/components/ui/Title/HighlightTitle";

export default function AboutUsSection() {
  return (
    <section className="body-content py-8">
      <HighlightTitle className="text-left w-full font-bold text-3xl md:text-4xl lg:text-5xl">
        Welcome to the{" "}
        <span className="text-primary font-bold">
          Department of the Registrar of Companies
        </span>
        , your gateway to{" "}
        <span className="text-primary font-bold">
          business registration, corporate, governance,and compliance
        </span>{" "}
        in <span className="font-bold text-foreground">Sri Lanka</span>.
      </HighlightTitle>

      <div className="space-y-4 text-base-text mt-5">
        <p>
          The Department of the Registrar of Companies (DRC) was formally
          established in 1938, under Section 51 of the Companies Ordinance No.51
          of 1938. Prior to this, company registration duties were managed under
          the Registrar General's Department, dating back to the Joint-Stock
          Companies Ordinance of 1861. These earlier functions included
          re-registration of locally operating companies and regulation of
          business activities under British rule.
        </p>
        <p>
          The DRC was created during a pivotal era of economic transformation,
          as the government recognized the need to support evolving business
          community demands—especially in the plantation sector—and to provide a
          dedicated body to administer corporate regulation and support.
        </p>
      </div>
    </section>
  );
}
