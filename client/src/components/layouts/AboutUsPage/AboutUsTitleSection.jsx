import AboutUsTitle from "@/components/ui/Title/AboutUsTitle";

export default function AboutUsTitleSection() {
    return (
        <section className="body-content py-8">
  <AboutUsTitle className="text-left w-full font-bold text-3xl md:text-4xl lg:text-5xl">
    Welcome to the{" "}
    <span className="text-primary font-bold">
      Department of the Registrar of Companies
    </span>
    , your gateway to{" "}
    <span className="text-primary font-bold">
      business&nbsp;registration, corporate&nbsp;governance, and&nbsp;compliance
    </span>{" "}
    in <span className="font-bold text-foreground">Sri&nbsp;Lanka</span>.
  </AboutUsTitle>
</section>

    );
}
