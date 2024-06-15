"use client";
import ConcertCard from "./ConcertCard";
import eventData from "../../data/events.json"

const ConcertFeed = () => {

  return(
    <div className="flex flex-col justify-center items-start w-full px-20 pb-12">
      <div className="font-bold text-2xl">
        Popular Events
      </div>
      <div className="my-3 text-xs text-slate-500 flex flex-row">
        <div className="border px-2 py-1 rounded-xl border-slate-500 min-w-8 text-center mr-4 cursor-pointer">
          All
        </div>
        <div className="border px-2 py-1 rounded-xl border-slate-500 min-w-8 text-center mr-4 cursor-pointer">
          Today
        </div>
        <div className="border px-2 py-1 rounded-xl border-slate-500 min-w-8 text-center mr-4 cursor-pointer">
          This Weekend
        </div>
        <div className="border px-2 py-1 rounded-xl border-slate-500 min-w-8 text-center mr-4 cursor-pointer">
          Free
        </div>
      </div>
      <div className="flex flex-row justify-between w-full flex-wrap my-4">
        {eventData.map((event) => 
          <ConcertCard
            key={event.eventId}
            eventId={event.eventId}
            img={event.eventImg}
            title={event.eventTitle}
            month={event.month}
            days={event.days}
            location={event.location}
            time={event.time}
          />
        )}
      </div>
      <div className="w-full flex justify-center">
        <div className="border rounded w-96 h-10 flex justify-center items-center font-bold border-gray-600 text-gray-700 cursor-pointer
        group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10 
        hover:bg-yellow-300 hover:border-black hover:text-black">
          See More
        </div>
      </div>
    </div>
  )
};

export default ConcertFeed;