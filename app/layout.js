import SmoothScrollLayout from "@/components/wrappers/smoothScrollWrapper";
import "./globals.css";
import { Lato } from "next/font/google";
import SceneLoader from "@/components/scene/sceneLoader";
import { Caesar_Dressing } from 'next/font/google';


const caesar = Caesar_Dressing({
  weight: '400',
  variable: "--font-caesar",
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
      className={`${caesar.variable} ${lato.variable} font-lato h-full antialiased`}
    >
      
      <body className="min-h-full flex flex-col">
        <SceneLoader/>
        <SmoothScrollLayout>
          {children}
        </SmoothScrollLayout>
      </body>
      
    </html>
  );
}
