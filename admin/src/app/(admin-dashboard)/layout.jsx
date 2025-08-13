import Header from "@/components/layout/Header";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";


const poppins = Poppins({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <Header />
        <SecondaryHeader />

        <div className="body-content">
          {children}
        </div>
      </body>
    </html>
  );
}
