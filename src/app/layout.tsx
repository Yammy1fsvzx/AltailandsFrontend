import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Inter, Play } from "next/font/google";
import "./globals.css"
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { fetchPrimaryContact } from "@/lib/api/fetchContacts";
import { Contact } from "@/types/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const play = Play({
  weight: ['400', '700'],
  subsets: ['cyrillic'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
})

export const metadata: Metadata = {
  title: "ЗемлиАлтая",
  description: "Эксклюзивная недвижимость и земельные участки в сердце Алтая для жизни и выгодных инвестиций. Уникальные объекты в престижных локациях Горного Алтая и Алтайского края.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contactData: Contact | null = await fetchPrimaryContact();

  return (
    <html lang="ru">
      <body className={`${plusJakartaSans.variable} ${inter.variable} ${play.className}`}>
        <Header phoneNumber={contactData?.phone || null} />
        {children}
        <Footer contactData={contactData} />
      </body>
    </html>
  )
}