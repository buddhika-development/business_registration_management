import Image from "next/image";
import Logo from "../components/ui/Logo";
import Hero from "../components/layouts/HomePage/Hero";
import StartManageProtect from "../components/layouts/HomePage/StartManageProtect";
import YourGrowth from "../components/layouts/HomePage/YourGrowth";
import Stats from "../components/layouts/HomePage/Stats";
import Newsletter from "../components/layouts/HomePage/Newsletter";
import Footer from "../components/layouts/Footer"

export default function Home() {
  return (
    <div>
      <Hero />
      <StartManageProtect />
      <YourGrowth />
      <Stats />
      <Newsletter />
      <Footer />
    </div>
  );
}
