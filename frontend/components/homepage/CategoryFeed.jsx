
const CategoryFeed = () => {
  return (
      <div className="flex justify-center items-center w-full px-20 h-auto my-8 text-white">
        <div className="w-full flex flex-col">
          <div className="font-semibold font-montserrat text-xl my-6">
            Explore Categories
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            <div className="flex flex-col justify-start items-center cursor-pointer group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
              <img src="/images/entertainment-guitarist.jpg" className="rounded-lg w-full h-48 object-cover" />
              <div className="mt-3 text-center font-playfair-display italic text-lg">
                Entertainment
              </div>
            </div>
            <div className="flex flex-col justify-start items-center cursor-pointer group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
              <img src="/images/conference-audience.png" className="rounded-lg w-full h-48 object-cover" />
              <div className="mt-3 text-center font-playfair-display italic text-lg">
                Educational & Business
              </div>
            </div>
            <div className="flex flex-col justify-start items-center cursor-pointer group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
              <img src="/images/art-museum.jpg" className="rounded-lg w-full h-48 object-cover" />
              <div className="mt-3 text-center font-playfair-display italic text-lg">
                Cultural & Arts
              </div>
            </div>
            <div className="flex flex-col justify-start items-center cursor-pointer group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
              <img src="/images/football-stadium.jpg" className="rounded-lg w-full h-48 object-cover" />
              <div className="mt-3 text-center font-playfair-display italic text-lg">
                Sports & Fitness
              </div>
            </div>
            <div className="flex flex-col justify-start items-center cursor-pointer group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
              <img src="/images/tech-robot.jpg" className="rounded-lg w-full h-48 object-cover" />
              <div className="mt-3 text-center font-playfair-display italic text-lg">
                Technology & Innovation
              </div>
            </div>
            <div className="flex flex-col justify-start items-center cursor-pointer group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10">
              <img src="/images/travel-adventure.jpg" className="rounded-lg w-full h-48 object-cover" />
              <div className="mt-3 text-center font-playfair-display italic text-lg">
                Travel & Adventure
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CategoryFeed;
