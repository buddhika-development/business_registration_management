import Image from "next/image";
import AboutUsTitle from "@/components/ui/Title/AboutUsTitle";

export default function Hero() {
  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {/* background image */}
      <Image
        src="/aboutUs-hero.png"      
        alt="Department front desk"
        fill
        priority
        className="object-cover object-center"
      />
    </section>
  );
}
