import Hero from "../components/layouts/HomePage/Hero";
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
    </div>
  );
}
