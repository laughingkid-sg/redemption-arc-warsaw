
const CategoryFeed = () => {
  return(
    <div className="flex justify-center items-center w-full px-20 h-56 my-8">
      <div className="w-full flex flex-col">
        <div className="font-bold text-2xl mb-6">
          Explore Categories
        </div>
        <div className="flex flex-row justify-evenly">
          <div className="flex flex-col justify-start items-center cursor-pointer w-36 group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
            <img src="/images/entertainment-guitarist.jpg" className="rounded"/>
            <div className="mt-3 text-center">
              Entertainment
            </div>
          </div>
          <div className="flex flex-col justify-start items-center cursor-pointer w-36 group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
            <img src="/images/conference-audience.png" className="rounded"/>
            <div className="mt-3 text-center">
              Educational & Business
            </div>
          </div>
          <div className="flex flex-col justify-start items-center cursor-pointer w-36 group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
            <img src="/images/art-museum.jpg" className="rounded"/>
            <div className="mt-3 text-center">
              Cultural & Arts 
            </div>
          </div>
          <div className="flex flex-col justify-start items-center cursor-pointer w-36 group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
            <img src="/images/football-stadium.jpg" className="rounded"/>
            <div className="mt-3 text-center">
              Sports & Fitness
            </div>
          </div>
          <div className="flex flex-col justify-start items-center cursor-pointer w-36 group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
            <img src="/images/tech-robot.jpg" className="rounded"/>
            <div className="mt-3 text-center">
              Technology & Innovation
            </div>
          </div>
          <div className="flex flex-col justify-start items-center cursor-pointer w-36 group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
            <img src="/images/travel-adventure.jpg" className="rounded"/>
            <div className="mt-3 text-center">
              Travel & Adventure
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CategoryFeed;