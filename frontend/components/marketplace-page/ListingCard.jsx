import React from 'react'
import { TbPigMoney } from "react-icons/tb";
import { MdRedeem } from "react-icons/md";

const ListingCard = ({listing}) => {


  return (
    <div className='flex shadow-md rounded-md mx-4 mb-4 justify-center items-center p-3'>
        <div>
            <img className='min-w-40 h-40 rounded-md mr-3' src={listing.tokenImgURL}/>
        </div>
        <div className='flex flex-col'>
            <div className='font-bold text-lg'>{listing.eventTitle}</div>
            <div className='font-semibold text-lg'>Category {listing.catClass} Ticket</div>
            <div className={`flex items-center ${listing.isRedeemed ? "text-red-600" : "text-green-600"}`}><MdRedeem/>{listing.isRedeemed ? "Redeemed" : "Redeemable"}</div>
            <div className={`flex items-center ${listing.isInsured ? "text-green-600" : "text-red-600"}`}><TbPigMoney/>{listing.isInsured ? "Insured" : "Uninsured"}</div>
            <div>{listing.listingPrice} TRX</div>
        </div>
    </div>
  )
}

export default ListingCard