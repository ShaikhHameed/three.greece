import SmoothScrollLayout from "@/components/wrappers/smoothScrollWrapper";
import "./globals.css";
import { Italianno } from 'next/font/google';
import { Lato } from "next/font/google";
import ThreeJsScene from "@/components/scene/threeScene";


const italianno = Italianno({
  weight: '400',
  variable: "--font-italianno",
  subsets: ['latin'],
  display: 'swap',
});

const lato = Lato({
  weight:["100", "300", "400", "700", "900"],
  subsets:['latin'],
  variable: "--font-lato",
  display:'swap',
})
 
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${italianno.variable} ${lato.variable} font-italianno h-full antialiased`}
    >
      
      <body className="min-h-full flex flex-col">
        <ThreeJsScene/>
      <SmoothScrollLayout>
        {children}
      </SmoothScrollLayout>
      </body>
      
    </html>
  );
}
