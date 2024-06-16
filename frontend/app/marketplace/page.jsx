"use client"

import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '@/app/Context/store'
import HomeSearchBar from '@/components/homepage/HomeSearchBar'
import ListingCard from '@/components/marketplace-page/ListingCard'
import ListingModal from '@/components/marketplace-page/ListingModal'
import Loading from '@/components/Loading'
import { MdOutlineSort } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

const Marketplace = () => {

  const {getAllActiveListings, marketplaceListings, isLoading, setIsLoading} = useGlobalContext()
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true)
      try {
        await getAllActiveListings();
      } catch (error) {
          console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false)
      }
    }
    fetchListings()
  }, [])

  useEffect(() => {
    console.log(marketplaceListings)
  }, marketplaceListings)

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
  };

    return (
      <section className="w-full flex-center flex-col h-full pb-20">
        {/* {isLoading && <Loading/>} */}
          <div className='w-full bg-gray-800 flex justify-center items-center'>
            <div className="hero-image flex flex-col w-full h-80 items-center justify-center relative">
              <div className="absolute w-full h-full bg-black bg-opacity-40 z-0"></div> {/* Overlay */}
              <div className="z-10 font-bold text-white text-3xl mb-3">
                Shop for tickets at the <span className="text-yellow-300">Marketplace</span>
              </div>
              <HomeSearchBar/>
            </div>
          </div>

          <div className='flex p-10 '>
            <div className='w-1/5 flex flex-col items-start justify-start border-r border-gray-300'>
              <div className='font-semibold text-lg'>Filters</div>

              <div className='my-2'>
                <div className='text-white mb-1 flex'><MdOutlineSort className="mr-2 mt-1"/>Sort By:</div>
                  <div className=''>
                    <select name="location" id="location" className="outline-none rounded-md p-1">
                      <option>Relevance</option>
                      <option>Latest</option>
                      <option>Popular</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </select>
                  </div>
              </div>

              <form className='w-full'>
                <div className='border-b border-gray-300 py-2 w-5/6'>
                  <div className='font-semibold text-md mb-2'>Price</div>
                  <input type='checkbox' id='free' name='free' value='Free'/>
                  <label htmlFor='free'>Free</label><br/>
                  <input type='checkbox' id='paid' name='paid' value='Paid'/>
                  <label htmlFor='paid'>Paid</label><br/>
                </div>
                <div className='border-b border-gray-300 py-2 w-5/6'>
                  <div className='font-semibold text-md mb-2'>Redeem Status</div>
                  <input type='checkbox' id='unredeemed' name='unredeemed' value='unredeemed'/>
                  <label htmlFor='unredeemed'>Unredeemed</label><br/>
                  <input type='checkbox' id='redeemeed' name='redeemeed' value='Redeemed'/>
                  <label htmlFor='redeemeed'>Redeemed</label><br/>
                </div>
                <div className='border-b border-gray-300 py-2 w-5/6'>
                  <div className='font-semibold text-md mb-2'>Insurance status</div>
                  <input type='checkbox' id='uninsured' name='uninsured' value='Uninsured'/>
                  <label htmlFor='uninsured'>Uninsured</label><br/>
                  <input type='checkbox' id='insured' name='insured' value='Insured'/>
                  <label htmlFor='insured'>Insured</label><br/>
                </div>
                <div className='border-b border-gray-300 py-2 w-5/6'>
                  <div className='font-semibold text-md mb-2'>Category</div>
                  <input type='checkbox' id='cat1' name='cat1' value='Cat 1'/>
                  <label htmlFor='cat1'>Cat 1</label><br/>
                  <input type='checkbox' id='cat2' name='cat2' value='Cat 2'/>
                  <label htmlFor='cat2'>Cat 2</label><br/>
                  <input type='checkbox' id='cat3' name='cat3' value='Cat 3'/>
                  <label htmlFor='cat3'>Cat 3</label><br/>
                  <input type='checkbox' id='cat4' name='cat4' value='Cat 4'/>
                  <label htmlFor='cat4'>Cat 4</label><br/>
                </div>
                <div className='border-b border-gray-300 py-2 w-5/6'>
                  <div className='font-semibold text-md mb-2'>Date</div>
                  <input type='checkbox' id='past' name='past' value='Past'/>
                  <label htmlFor='past'>Past</label><br/>
                  <input type='checkbox' id='today' name='today' value='Today'/>
                  <label htmlFor='today'>Today</label><br/>
                  <input type='checkbox' id='tomorrow' name='tomorrow' value='Tomorrow'/>
                  <label htmlFor='tomorrow'>Tomorrow</label><br/>
                  <input type='checkbox' id='thisWeek' name='thisWeek' value='This Week'/>
                  <label htmlFor='thisWeek'>This Week</label><br/>
                  <input type='checkbox' id='thisWeekend' name='thisWeekend' value='This Weekend'/>
                  <label htmlFor='thisWeekend'>This Weekend</label><br/>
                  <button className='text-blue-600'>More</button>
                </div>
                <div className=' py-2 w-5/6'>
                  <div className='font-semibold text-md mb-2'>Category</div>
                  <input type='checkbox' id='entertainment' name='entertainment' value='Entertainment'/>
                  <label htmlFor='entertainment'>Entertainment</label><br/>
                  <input type='checkbox' id='educationBusiness' name='educationBusiness'
                         value='Educational & Business'/>
                  <label htmlFor='educationBusiness'>Educational & Business</label><br/>
                  <input type='checkbox' id='culturalArts' name='culturalArts' value='Cultural & Arts'/>
                  <label htmlFor='culturalArts'>Cultural & Arts</label><br/>
                  <input type='checkbox' id='sportsFitness' name='sportsFitness' value='Sports & Fitness'/>
                  <label htmlFor='sportsFitness'>Sports & Fitness</label><br/>
                  <input type='checkbox' id='techInnovation' name='techInnovation' value='Technology & Innovation'/>
                  <label htmlFor='techInnovation'>Technology & Innovation</label><br/>
                  <input type='checkbox' id='travelAdventure' name='travelAdventure' value='Travel & Adventure'/>
                  <label htmlFor='travelAdventure'>Travel & Adventure</label><br/>
                  <button className='text-blue-600'>More</button>
                </div>
                <button className="border rounded-3xl w-5/6 flex justify-center items-center border-white text-black bg-white
                hover:bg-yellow-300 hover:border-black hover:text-black mt-3 py-1">
                  Confirm
                </button>
              </form>
            </div>
            <div className='w-4/5 flex flex-wrap justify-evenly items-start h-min px-4'>
              {marketplaceListings.map(
                  (listing) => (
                      <div onClick={() => handleListingClick(listing)} key={listing.listingId}
                           className='cursor-pointer w-1/2 '>
                        <ListingCard
                            listing={listing}
                        />
                      </div>
                  )
              )}
            </div>
          </div>
        <ListingModal isOpen={!!selectedListing} listing={selectedListing} onClose={handleCloseModal}/>
      </section>
    )
  }
  
  export default Marketplace