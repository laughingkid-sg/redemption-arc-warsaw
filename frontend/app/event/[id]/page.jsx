"use client";
import eventData from "../../../data/events.json";
import { LuCalendarDays } from "react-icons/lu";
import { LuClock } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { CiCreditCard1 } from "react-icons/ci";
import { ethers } from "ethers";

import ConcertCard from "@/components/homepage/ConcertCard";
import { IoTicketOutline } from "react-icons/io5";
import { LuPlusCircle } from "react-icons/lu";
import { LuMinusCircle } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/app/Context/store";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegThumbsDown } from "react-icons/fa";
import TransactionLoading from "@/components/TransactionLoading";
import ConfirmationModal from "@/components/ConfirmationModal";
import Loading from "@/components/Loading";
import { useQueryClient } from "react-query";

const EventPurchase = ({ params }) => {
  const {
    decodeHexString,
    isTransactionLoading,
    setIsTransactionLoading,
    mintTicket,
    getCatPrices,
    getMintLimit,
    isEventCanceled,
    getSaleStartTime,
    setIsConfirmationModalOpen,
    isConfirmationModalOpen,
    transactionUrl,
    setTransactionUrl,
    isLoading,
    setIsLoading,
    loadEventPageData,
    account,

    getAllOwnedTokens,
    getOwnedTokenIds
  } = useGlobalContext();

  const [selectedCategory, setSelectedCategory] = useState(1); // actual cat index is different from the selected categoryyyyy
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [eventMintLimit, setEventMintLimit] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [saleStartTime, setSaleStartTime] = useState(null);
  const eventId = params.id;
  const event = eventData.find((event) => event.eventId === eventId);
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true); // Start loading before all async requests

      try {
        // Using Promise.all to wait for all data fetching before proceeding
        const { mintLimit, isCancelled, startTime } = await loadEventPageData(
          event.contractAddress
        );

        // Process mint limit
        setEventMintLimit(mintLimit);

        // Process cancellation status
        setIsCancelled(isCancelled);

        // Process and format sale start time
        const date = new Date(startTime * 1000);
        const optionsDate = { day: "numeric", month: "short", year: "numeric" };
        const formattedDate = date
          .toLocaleDateString("en-US", optionsDate)
          .toUpperCase();

        const optionsTime = {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };
        const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
        setSaleStartTime(`${formattedTime} ${formattedDate}`);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false); // End loading after all operations are complete
      }
    };

    loadData();
  }, []);

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const incrementCat = () => {
    setSelectedCategory((prevCount) => prevCount + 1);
  };

  const decrementCat = () => {
    setSelectedCategory((prevCount) => prevCount - 1);
  };

  const incrementQuantity = () => {
    setSelectedQuantity((prevCount) => prevCount + 1);
  };

  const decrementQuantity = () => {
    setSelectedQuantity((prevCount) => prevCount - 1);
  };

  //TODO: Implement the purchase logic
  const handlePurchase = async () => {
    setIsTransactionLoading(true);

    alert("Purchase logic not implemented yet, you chose to pay with: " + paymentMethod);

    console.log(
      "current state information: ",
      selectedCatIndex,
      selectedQuantity
    );
    try {
      const ticketPrice = await getCatPrices(
        selectedCatIndex,
        event.contractAddress
      );

      const { success, error, result } = await mintTicket(
        selectedCatIndex,
        selectedQuantity,
        ticketPrice,
        event.contractAddress
      );

      if (!success) {
        throw new Error(error);
      }
      queryClient.invalidateQueries(["tickets", account]);
      setTransactionUrl(`https://subnets-test.avax.network/c-chain/tx/${result}`);
      setIsConfirmationModalOpen(true);
    } catch (err) {
      alert(`Error during transaction: ${err.message}`);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start py-10 pb-20 bg-black">
      {isLoading && <Loading />}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        url={transactionUrl}
      />
      {isTransactionLoading && <TransactionLoading />}
      <div className="max-w-1/2 flex flex-col items-center justify-center bg-black text-white rounded-md p-7 shadow-lg">
        <img src={event.eventImg} className="h-[400px] w-[800px] rounded-md" />
        <div className="flex flex-col justify-start items-stretch w-[800px]">
          <div className="flex items-center my-5">
            <div className="font-extrabold text-3xl mr-3">
              {event.eventTitle}
            </div>
            {isCancelled ? (
              <span className="flex items-center text-red-500 text-lg">
                <FaRegThumbsDown className="mr-1" />
                Event Cancelled
              </span>
            ) : (
              <span className="flex items-center text-green-500 text-lg">
                <FaRegThumbsUp className="mr-1" />
                Event Active
              </span>
            )}
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-3/4">
              <div className="text-xl font-semibold my-1">Date and Time</div>
              <div className="flex justify-start items-center my-0.5">
                <LuCalendarDays className="mr-3" /> {event.date}
              </div>
              <div className="flex justify-start items-center my-0.5">
                <LuClock className="mr-3" /> {event.time}
              </div>
              <div className="my-0.5 text-blue-500">+ Add to Calendar</div>
              <div className="w-full">
                <div className="mt-4 mb-2 font-semibold text-xl">Location</div>
                <div className="mb-4 flex flex-row items-center">
                  <IoLocationOutline className="mr-3" />
                  <div className="w-3/4">{event.location}</div>
                </div>
                <img
                  src="/images/stadium-google-map.png"
                  className="h-50 w-96 my-2 rounded-md"
                />
              </div>
              <div className="mt-4 mb-2 font-semibold text-xl">
                Event Description
              </div>
              <div className="items-center w-[90%] text-sm">
                {event.description.map((paragraph) => (
                  <p key={event.eventId}>{paragraph}</p>
                ))}
              </div>
              <br />
            </div>
            <div className="w-1/4">
              <div className="flex flex-col">
                <div className="mb-1 font-semibold text-xl">
                  Ticket Information
                </div>
                <div>General Sale: </div>
                <div className="font-medium mb-1">{saleStartTime}</div>
                {event.catPricing.map((price, index) => (
                  <div className="text-sm" key={index}>
                    Cat {index + 1}:{" "}
                    <span className="font-semibold">{ethers.utils.formatEther(price)} AVAX</span>
                  </div>
                ))}
                <div className="text-sm">
                  Mint Limit:{" "}
                  <span className="font-semibold">
                    {eventMintLimit} Ticket(s)
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start mt-2">
                <div className="font-medium text-lg">Select your Category</div>
                <div className="flex flex-row justify-evenly items-center w-3/4">
                  <button
                    onClick={decrementCat}
                    disabled={selectedCategory <= 1}
                  >
                    <LuMinusCircle
                      className={`${selectedCategory <= 1 && "text-gray-400"}`}
                    />
                  </button>
                  {selectedCategory}
                  <button
                    onClick={incrementCat}
                    disabled={selectedCategory >= 4}
                  >
                    <LuPlusCircle
                      className={`${selectedCategory >= 4 && "text-gray-400"}`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-start mt-2">
                <div className="font-medium text-lg">Select your Quantity</div>
                <div className="flex flex-row justify-evenly items-center w-3/4">
                  <button
                    onClick={decrementQuantity}
                    disabled={selectedQuantity <= 1}
                  >
                    <LuMinusCircle
                      className={`${selectedQuantity <= 1 && "text-gray-400"}`}
                    />
                  </button>
                  {selectedQuantity}
                  <button
                    onClick={incrementQuantity}
                    disabled={selectedQuantity >= eventMintLimit}
                  >
                    <LuPlusCircle
                      className={`${
                        selectedQuantity >= eventMintLimit && "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="w-3/4 flex justify-center flex-col mt-3 gap-y-2">
                <h1 className="font-semibold">Pay using</h1>
                <div
                  className={`border-2 group w-[200px] pxl-2 py-2 rounded font-semibold flex items-center justify-start`}
                >
                  <div className={`ml-3 flex items-center`}>
                    <input
                      type="radio"
                      name="payment"
                      id="blik"
                      value="creditCard"
                      className="mr-2"
                      onChange={handlePaymentChange}
                    />
                    <CiCreditCard1 className="w-6 h-6 mr-2" />
                    <p className="font-semibold text-sm">Credit Card</p>
                  </div>
                </div>
                <div
                  className={`border-2 group w-[200px] pxl-2 py-2 rounded font-semibold flex items-center justify-start`}
                >
                  <div className={`ml-3 flex items-center`}>
                    <input
                      type="radio"
                      name="payment"
                      id="blik"
                      value="blik"
                      className="mr-2"
                      onChange={handlePaymentChange}
                    />
                    <img src="/images/blik.svg" className="w-9 h-6 mr-2" />
                    <p className="font-semibold  text-sm">blik</p>
                  </div>
                </div>
                <div
                  className={`border-2 group w-[200px] pxl-2 py-2 rounded font-semibold flex items-center justify-start`}
                >
                  <div className={`ml-3 flex items-center`}>
                    <input
                      type="radio"
                      name="payment"
                      id="blik"
                      value="ava"
                      className="mr-2"
                      onChange={handlePaymentChange}
                    />
                    AVA Token
                  </div>
                </div>
                <button
                  disabled={paymentMethod === null}
                  onClick={handlePurchase}
                  className={`${
                    paymentMethod === null ? "bg-gray-400 text-gray-200" : "bg-yellow-400"
                  }  w-[200px] p-2 rounded-3xl mt-2`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[800px]">
          <div className="mt-4 mb-1 font-semibold text-xl">
            Other events you may like
          </div>

          <div className="items-center w-full grid grid-cols-2 gap-5">
            <ConcertCard
              eventId="2"
              img="/images/coldplay-concert.jpg"
              title="Coldplay Music of the Spheres"
              month="JUN"
              days="23-31"
              location="Singapore National Stadium"
              time="8:00PM - 10:00PM"
            />
            <ConcertCard
              eventId="3"
              img="/images/1975-concert.jpg"
              title="1975 Concert"
              month="AUG"
              days="22"
              location="Sands Expo and Convention Centre"
              time="8:00PM - 10:00PM"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPurchase;
