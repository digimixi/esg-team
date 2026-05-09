import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: "esg.team | 產業綠色轉型聚合入口",
  description: "全球產業綠色轉型聚合平台",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
