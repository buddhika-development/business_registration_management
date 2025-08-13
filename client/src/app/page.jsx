import Image from "next/image";
import Logo from "../components/ui/Logo";
import Hero from "../components/layouts/HomePage/Hero";
import Newsletter from "@/components/layouts/HomePage/Newsletter";

export default function Home() {
  return (
    <div>
      <Hero />
      <Newsletter />
    </div>
  );
}
