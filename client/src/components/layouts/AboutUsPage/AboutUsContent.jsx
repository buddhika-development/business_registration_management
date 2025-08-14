import HighlightTitle from "@/components/ui/Title/HighlightTitle";

export default function AboutUsContent() {
    return (
        <section className="body-content pt-0 pb-10 space-y-6">

            <HighlightTitle className="text-left w-full font-bold text-3xl md:text-4xl lg:text-5xl">
                We are here to protect you
                <br />
                Not{" "}
                <span className="text-primary font-bold">
                    limit your capacity
                </span>
            </HighlightTitle>

            {/* Mission paragraph */}
            <div className="space-y-4 text-base-text">
                <p>
                    Our mission is to facilitate the establishment and regulation of
                    corporate and institutional entities under relevant legislation in
                    alignment with Sri Lanka's economic and trade policies. We also ensure
                    the operational effectiveness of these organizations and support
                    broader commercial activity across the country.
                </p>
            </div>
        </section>
    );
}
