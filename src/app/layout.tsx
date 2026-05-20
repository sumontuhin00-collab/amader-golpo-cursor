import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "আমাদের গল্প | বাংলা গল্প ও সাহিত্য প্ল্যাটফর্ম",
    template: "%s | আমাদের গল্প",
  },
  description:
    "বাংলা গল্প, কবিতা ও সাহিত্যের প্রিমিয়াম প্ল্যাটফর্ম। লিখুন, পড়ুন এবং ভাগ করুন।",
  keywords: ["বাংলা গল্প", "সাহিত্য", "কবিতা", "আমাদের গল্প"],
  openGraph: {
    title: "আমাদের গল্প",
    description: "বাংলা গল্প ও সাহিত্যের প্রিমিয়াম প্ল্যাটফর্ম",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${hindSiliguri.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
