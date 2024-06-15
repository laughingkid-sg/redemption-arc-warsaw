"use client"

import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

const ConcertCard = ({eventId, img, title, month, days, time, location}) => {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/event/${eventId}`)
    }

    return (
        <div
            className="rounded-lg flex flex-col my-5 cursor-pointer bg-cardColor
            group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10 hover:bg-yellow-300 hover:text-black"
            onClick={handleClick}
        >
            <img src={img} className="rounded-t-lg w-full h-48 object-cover"/>

            <div className="w-full flex px-3 py-6">
                <div className="flex flex-col w-1/4 items-center justify-center">
                    <div className="font-semibold text-xl">
                        {month}
                    </div>
                    <div className="font-bold text-xl">
                        {days}
                    </div>
                </div>

                <div className="flex flex-col w-3/4 pl-3 justify-center">
                    <div className="font-playfair-display italic text-lg mb-2">{title}</div>
                    <div className="text-sm">{location}</div>
                    <div className="text-sm">{time}</div>
                </div>
            </div>

            <div className="flex flex-row mb-6 justify-end items-center w-full pr-5">
                <span>View Details</span> <FaArrowRight className="ml-2 mt-1"/>
            </div>
        </div>
    )
};

export default ConcertCard;