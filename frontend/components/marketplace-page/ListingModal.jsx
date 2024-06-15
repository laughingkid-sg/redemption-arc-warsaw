"use client"

import React from 'react';
import { RiCoinsLine } from "react-icons/ri";
import { TbPigMoney } from "react-icons/tb";
import { MdRedeem } from "react-icons/md";
import { IoClose } from "react-icons/io5"; 
import { useGlobalContext } from '@/app/Context/store';
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegThumbsDown } from "react-icons/fa";
import ConfirmationModal from '../ConfirmationModal';
import { useQueryClient } from 'react-query';

const ListingModal = ({ isOpen, listing, onClose }) => {
  const {buyTicket, isTronLinkConnected, setIsTransactionLoading, decodeHexString, setIsConfirmationModalOpen, isConfirmationModalOpen, transactionUrl, setTransactionUrl, account} = useGlobalContext()
  if (!isOpen) return null;

  console.log(listing)
  const queryClient = useQueryClient()

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const buyResaleTicket = async () => {
    setIsTransactionLoading(true)
    if (!isTronLinkConnected()) {
      alert("Please connect your TronLink Wallet before buying ticket insurance")
      setIsTransactionLoading(false)
      return
    }

    try {
      const {success, error, result} = await buyTicket(listing.listingId, listing.listingPrice)

      if (!success){
        throw new Error(decodeHexString(error.output.contractResult[0]))
      }
      queryClient.invalidateQueries(['tickets', account])
      setTransactionUrl(`https://nile.tronscan.org/#/transaction/${result}`)
      setIsConfirmationModalOpen(true)
    } catch (err) {
      alert(`Error during transaction: ${err.message}`);
    } finally {
      setIsTransactionLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20" onClick={onClose}>
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        url={transactionUrl}
      />
      <div className="bg-white p-5 rounded-lg w-3/4 h-3/4 overflow-y-auto"  onClick={handleModalClick}>
        <div className='flex flex-row justify-between items-start w-full h-auto'>
            <div className='flex flex-col justify-center items-center w-1/2 py-4 px-6 my-6 border-r border-gray-500'>
                <img src={listing.tokenImgURL} alt="Token" className='w-72 h-72'/>
                <div className='overflow-y-auto mt-5 mb-4'>
                    <div className='font-semibold text-xl'>Event Description</div>
                    <div className='text-sm mt-5'>
                        {listing.eventDescription.map((para, index) => <p key={index}>{para}</p>)}
                    </div>
                </div>
            </div>
            <div className='w-1/2 py-4 px-6 my-6 overflow-y-auto'>
                <div className='text-3xl font-bold'>{listing.eventTitle}</div>
                <div className='font-semibold text-lg'>{listing.date}</div>
                <div className='text-md'>{listing.time}</div>
                <div className='text-md'>{listing.location}</div>
                <div className='flex'>
                  {listing.isCancelled ? (
                      <span className='flex items-center text-red-600 font-semibold'>
                          <FaRegThumbsDown className='mr-1'/>
                          Event Cancelled
                      </span>
                  ) : (
                      <span className='flex items-center text-green-600 font-semibold'>
                          <FaRegThumbsUp className='mr-1'/>
                          Event Active
                      </span>
                  )}
                </div>
                <div className='text-sm text-gray-600 mt-3'>CATEGORY {listing.catClass} TICKET</div>
                <div className='text-sm text-gray-600'>TICKET ID: {listing.tokenId}</div>
                <div className='text-sm text-gray-600 mb-3'>OWNER WALLET ADDRESS: {listing.sellerAddress}</div>
                <div className={`flex items-center ${listing.isRedeemed ? "text-red-600" : "text-green-600"}`}><MdRedeem/>{listing.isRedeemed ? "Redeemed" : "Redeemable"}</div>
                <div className={`flex items-center ${listing.isInsured ? "text-green-600" : "text-red-600"}`}><TbPigMoney/>{listing.isInsured ? "Insured" : "Uninsured"}</div>
                <div className='text-2xl font-bold my-3 flex flex-row items-center'><RiCoinsLine/> {listing.listingPrice} TRX</div>
                <button className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold text-2xl w-48 py-1.5 rounded-md" onClick={buyResaleTicket}>
                    BUY NOW
                </button>
            </div>
            <button onClick={onClose} className="text-lg">
              <IoClose />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;