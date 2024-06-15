"use client"

import { useRouter } from "next/navigation";

const ConcertCard = ({eventId, img, title, month, days, time, location}) => {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/event/${eventId}`)
    }

    return(
        <div className="rounded-lg w-80 h-64 flex flex-col my-5 cursor-pointer 
            group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10 hover:bg-yellow-300"
            onClick={handleClick}
        >
            <div className="w-full">
                <img src={img} className="rounded-t-lg w-full h-40 object-cover"/>
            </div>
            <div className="w-full flex flex-row p-2">
                <div className="flex flex-col w-1/4 items-center">
                    <div className="font-semibold text-xl">
                        {month}
                    </div>
                    <div className="font-bold text-xl ">
                        {days}
                    </div>
                </div>
                <div className="flex flex-col w-3/4 items-start pl-1">
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm">{location}</div>
                    <div className="text-sm">{time}</div>
                </div>
            </div>
        </div>
    )
};

export default ConcertCard;