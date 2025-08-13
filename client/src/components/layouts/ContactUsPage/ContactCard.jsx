// src/components/layouts/ContactUsPage/ContactCard.jsx
import Image from "next/image";
import ContactHeader from "./ContactHeaderSection";

export default function ContactCard() {
  return (
    <section className="body-content py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left: image */}
        <div className="lg:col-span-5 hidden md:block">
          <div className="relative w-full max-w-[460px] mx-auto">
            <Image
              src="/contactUs.png"
              alt="Support officers"
              width={920}
              height={1100}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Right: header + form */}
        <div className="lg:col-span-7">
          <div className="space-y-6">
            <ContactHeader /> 

            <form className="space-y-4 mt-8">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium basetext mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium basetext mb-1">
                  Contact Number:
                </label>
                <input
                  type="tel"
                  placeholder="07X XXXXXXX"
                  required
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium basetext mb-1">
                  Description:
                </label>
                <textarea
                  placeholder="What is your problem"
                  rows={4}
                  className="w-full resize-y rounded-lg bg-indigo-100 px-4 py-3 outline-none ring-0 focus:bg-indigo-50 focus:border-primary focus:ring-2 focus:ring-primary/30 border border-transparent transition"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
