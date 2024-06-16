"use client";
import ConcertCard from "./ConcertCard";
import eventData from "../../data/events.json"

const ConcertFeed = () => {

  return(
      <div className="flex flex-col justify-center items-start w-full px-20 pb-12 text-white">
          <div className="font-semibold font-montserrat text-xl mt-4">
              Upcoming Events
          </div>
          <div className="mt-6 mb-2 text-sm text-slate-500 flex flex-row">
              <div
                  className="font-work-sans text-black border px-4 py-2 rounded-3xl border-slate-500 min-w-8 text-center mr-4 cursor-pointer bg-white hover:bg-yellow-300 hover:border-yellow-300">
                  All
              </div>
              <div
                  className="font-work-sans text-black border px-4 py-2 rounded-3xl border-slate-500 min-w-8 text-center mr-4 cursor-pointer bg-white hover:bg-yellow-300 hover:border-yellow-300">
                  Today
              </div>
              <div
                  className="font-work-sans text-black border px-4 py-2 rounded-3xl border-slate-500 min-w-8 text-center mr-4 cursor-pointer bg-white hover:bg-yellow-300 hover:border-yellow-300">
                  This Weekend
              </div>
              <div
                  className="font-work-sans text-black border px-4 py-2 rounded-3xl border-slate-500 min-w-8 text-center mr-4 cursor-pointer bg-white hover:bg-yellow-300 hover:border-yellow-300">
                  Free
              </div>
          </div>
          <div className="grid grid-cols-4 justify-between w-full flex-wrap mb-4 gap-5">
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
              <div className="font-work-sans mt-6 border w-80 py-3 flex justify-center items-center text-black bg-white hover:bg-yellow-300 rounded-3xl
        group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10  hover:border-black hover:text-black">
                  See More
              </div>
          </div>
      </div>
  )
};

export default ConcertFeed;