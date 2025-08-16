// app/fonts.ts
import { Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
