"use client"

import React, { useState } from 'react'
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegThumbsDown } from "react-icons/fa";
import { useGlobalContext } from '@/app/Context/store';
import TransactionLoading from '../TransactionLoading';
import ListTicketModal from './ListTicketModal';
import RedeemTicketModal from './RedeemTicketModal';
import ConfirmationModal from '../ConfirmationModal';
import { useQueryClient } from 'react-query';

const TicketCard = ({contractAddress, eventId, title, date, time, location, tokenId, isRedeemed, isInsured, catClass, imageURL, isCancelled, originalTicketPrice, isListed}) => {
    const {isTransactionLoading, setIsTransactionLoading, buyInsurance, redeemTicket, decodeHexString, setMyTickets, setIsConfirmationModalOpen, isConfirmationModalOpen, transactionUrl, setTransactionUrl, account, getAllOwnedTokens} = useGlobalContext()
    const [isListPopupOpen, setIsListPopupOpen] = useState(false); 
    const [isRedeemPopupOpen, setIsRedeemPopupOpen] = useState(false); 
    const queryClient = useQueryClient()

    const handleBuyInsurance = async () => {
        setIsTransactionLoading(true)
    
        try {
          const {success, error, result} = await buyInsurance(contractAddress, tokenId, originalTicketPrice)
    
          if (!success){
            throw new Error(decodeHexString(error.output.contractResult[0]))
          }
          // getAllOwnedTokens(account)
          queryClient.invalidateQueries(['tickets', account])
          setTimeout(() => {
            setIsTransactionLoading(false);
          }, 10000);
          setTransactionUrl(`https://subnets-test.avax.network/c-chain/tx/${result}`)
          setIsConfirmationModalOpen(true)
        } catch (err) {
          alert(`Error during transaction: ${err.message}`);
          setIsTransactionLoading(false)
        }
    }

    const handleCloseModal = () => {   
      setIsListPopupOpen(false)
      setIsRedeemPopupOpen(false)
    }

  return (
    <div className='border-b-2 border-black mx-8 my-2 py-2 flex flex-row w-full'>
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        url={transactionUrl}
      />
      {isListPopupOpen && 
        <ListTicketModal 
          tokenId={tokenId}
          contractAddress={contractAddress}
          onClose={handleCloseModal} 
        />
      }
      {isRedeemPopupOpen && 
        <RedeemTicketModal 
          tokenId={tokenId}
          contractAddress={contractAddress}
          onClose={handleCloseModal} 
        />
      }
        <div>
            <img src={imageURL} className='w-40 h-40 rounded-md bg-blue-400' alt='NFT_Image'/>
        </div>
        <div className='mx-4 flex flex-col max-h-40 w-3/4 justify-center'>
            <div className='flex'>
                <span className='text-xl font-bold mr-3'>{title}</span>
                {isCancelled ? (
                    <span className='flex items-center text-red-500'>
                        <FaRegThumbsDown className='mr-1'/>
                        Event Cancelled
                    </span>
                ) : (
                    <span className='flex items-center text-green-500'>
                        <FaRegThumbsUp className='mr-1'/>
                        Event Active
                    </span>
                )}
            </div>
            <div>{date}</div>
            <div>{time}</div>
            <div>{location}</div>
            <div>Cat {catClass} Ticket</div>
            <div>Token ID: {tokenId}</div>
        </div>
        <div className=' flex flex-col justify-evenly items-center'>
            <button disabled={isInsured || isCancelled} className={`${isInsured ? "text-yellow-300 bg-gray-700 cursor-default" :"bg-yellow-300 hover:bg-yellow-400 text-black" } font-work-sans  text-md w-28 py-1 rounded-3xl`} onClick={handleBuyInsurance}>
                {isInsured ? "Insured!": "Insure"}
            </button>
            <button disabled={isRedeemed || isCancelled} className={`${isRedeemed ? "text-yellow-300 bg-gray-700 cursor-default" :"bg-yellow-300 hover:bg-yellow-400 text-black" } font-work-sans  text-md w-28 py-1 rounded-3xl`} onClick={() => setIsRedeemPopupOpen(true)}>
                {isRedeemed ? "Redeemed!": "Redeem"}
            </button>
            <button disabled={isListed} className={`${isListed ? "text-yellow-300 bg-gray-700 cursor-default" :"bg-yellow-300 hover:bg-yellow-400 text-black" } font-work-sans  text-md w-28 py-1 rounded-3xl`} onClick={() => setIsListPopupOpen(true)}>
                {isListed ? "Listed!": "List"}  
            </button>
        </div>
    </div>
  )
}

export default TicketCard