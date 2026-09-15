import HomeBanner from "@/components/sections/bannerSection";
import BottomSection from "@/components/sections/bottomSection";
import HomeSection from "@/components/sections/contentSection";

export default function Home() {


  return (
    <>
    <main className="relative z-[500] container mx-auto">
      <HomeBanner title={'Lorem Ipsum'} content={'Loremn Ipsum dittum'}/>
      <HomeSection title={'Lorem Ipsum'} content={"lorem ipsum dittum"}/>
      <HomeSection title={'Lorem Ipsum'} content={"lorem ipsum dittum"}/>
      <BottomSection title={"That's a dope shot."}/>
    </main>
    </>
  )
}