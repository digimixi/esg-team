import "./globals.css";
import BackToTopButton from "@/components/BackToTopButton";
import VisitorTracker from "@/components/VisitorTracker";

const inter = { className: "font-sans" };

export const metadata = {
  title: {
    default: "esg.team | 全球產業綠色轉型聚合平台",
    template: "%s | esg.team"
  },
  description: "領先的 ESG 產業情報與供應鏈轉型平台，專注於鋼鐵、石墨電極與重工業減碳。",
  keywords: ["ESG", "鋼鐵減碳", "石墨電極", "綠色轉型", "供應鏈情報"],
  authors: [{ name: "esg.team" }],
  openGraph: {
    title: "esg.team | 全球產業綠色轉型聚合平台",
    description: "全球產業綠色轉型聚合平台",
    url: 'https://esg.team',
    siteName: 'esg.team',
    locale: 'zh_TW',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <VisitorTracker />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
