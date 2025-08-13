import Image from "next/image";
import Logo from "../components/ui/Logo";
import Hero from "../components/layouts/HomePage/Hero";
import Newsletter from "@/components/layouts/HomePage/Newsletter";
import StartManageProtect from "@/components/layouts/HomePage/StartManageProtect";
import Stats from "@/components/layouts/HomePage/Stats";
import YourGrowth from "@/components/layouts/HomePage/YourGrowth";

export default function Home() {
  return (
    <div>
      <Hero />
      <StartManageProtect />
      <YourGrowth />
      <Stats />
      <Newsletter />
    </div>
  );
}
