import HomeSearchBar from "./HomeSearchBar";

const HomeHero = () => {
  return(
    <div className="hero-image flex flex-col w-full h-80 items-center justify-center relative">
      <div className="absolute w-full h-full bg-black bg-opacity-40 z-0"></div> {/* Overlay */}
      <div className="z-10 font-bold text-white text-3xl">
        Don't miss out!
        <br/>
        Explore the <span className="text-yellow-300">vibrant events</span> happening locally and globally
      </div>
      <HomeSearchBar/>
    </div>
  )
};

export default HomeHero;