import AboutUsTitle from "@/components/ui/Title/AboutUsTitle";

export default function AboutUsContent() {
    return (
        <section className="body-content pt-0 pb-10 space-y-6">
            
            {/* First paragraph block */}
            <div className="space-y-4 text-gray-700">
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
                    community demands—especially in the plantation sector—and to provide
                    a dedicated body to administer corporate regulation and support.
                </p>
            </div>

            <AboutUsTitle className="text-left w-full font-bold text-3xl md:text-4xl lg:text-5xl">
                We are here to protect you
                <br />
                Not{" "}
                <span className="text-primary font-bold">
                    limit your capacity
                </span>
            </AboutUsTitle>

            {/* Mission paragraph */}
            <div className="space-y-4 text-gray-700">
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
