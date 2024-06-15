"use client";

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGlobalContext } from '../Context/store';

const ListingContent = () => {
  const { marketplaceListings, getAllActiveListings } = useGlobalContext();
  const searchParams = useSearchParams();
  const paramListingId = searchParams.get("listingId");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        await getAllActiveListings();
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };
    fetchListings();
  }, []);

  const listingDetails = marketplaceListings.find(listing => listing.listingId === parseInt(paramListingId));

  console.log("this is the found listing: ", listingDetails);

  return (
    <div className='w-full h-full pb-20'>
      <div className='w-full px-4 my-4'>
        <Link href='/marketplace'>Marketplace</Link> | <span className='font-semibold'>{listingDetails?.eventTitle}</span>
      </div>
      <div className='flex flex-row justify-center items-center w-full mx-6'>
        <div className='flex flex-col justify-center max-w-1/2'>
          <img src={listingDetails?.tokenImgURL} className='w-80 h-80' />
          <div className='flex flex-col items-start justify-center w-full'>
            <div className='font-semibold text-xl'>Event Description</div>
            <div className='text-sm'>{listingDetails?.eventDescription?.map((para, index) => <p key={index}>{para}</p>)}</div>
          </div>
        </div>
        <div>
          listing details
        </div>
      </div>
    </div>
  );
};

const ListingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListingContent />
    </Suspense>
  );
};

export default ListingPage;



// "use client"

// import React, { useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'
// import { useGlobalContext } from '../Context/store'

// const ListingPage = () => {
//     const {marketplaceListings, getAllActiveListings} = useGlobalContext()
//     const searchParams = useSearchParams()
//     const paramListingId = searchParams.get("listingId")
//     // const tokenId = searchParams.get("tokenId")
//     // const listingPrice = searchParams.get("listingPrice")
//     // const eventTitle = searchParams.get("eventTitle")
//     // const date = searchParams.get("date")
//     // const time = searchParams.get("time")
//     // const eventDescription = searchParams.get("eventDescription")
//     // const isRedeemed = searchParams.get("isRedeemed")
//     // const isInsured = searchParams.get("isInsured")
//     // const catClass = searchParams.get("catClass")
//     // const tokenImgURL = searchParams.get("tokenImgURL")

//     useEffect(() => {
//         const fetchListings = async () => {
//             try {
//                 await getAllActiveListings();
//             } catch (error) {
//                 console.error("Failed to fetch listings:", error);
//             }
//         }
//         fetchListings()
//     }, [])

//     const listingDetails = marketplaceListings.find(listing => listing.listingId === parseInt(paramListingId))

//     console.log("this is the found listing: ", listingDetails)

//   return (
//     <div className='w-full h-full pb-20'>
//         <div className='w-full px-4 my-4'>
//             <Link href='/marketplace'>Marketplace</Link> | <span className='font-semibold'>{listingDetails.eventTitle}</span>
//         </div>
//         <div className='flex flex-row justify-center items-center w-full mx-6'>
//             <div className='flex flex-col justify-center max-w-1/2'>
//                 <img src={listingDetails.tokenImgURL} className='w-80 h-80'/>
//                 <div className='flex flex-col items-start justify-center w-full'>
//                     <div className='font-semibold text-xl'>Event Description</div>
//                     <div className='text-sm'>{listingDetails.eventDescription.map((para) => <p>{para}</p>)}</div>
//                 </div>
//             </div>
//             <div>
//                 listing details
//             </div>
//         </div>
//     </div>
//   )
// }

// export default ListingPage