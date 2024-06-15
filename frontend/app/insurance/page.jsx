"use client"
import React, { useEffect } from 'react'
import { useGlobalContext } from '../Context/store'
import Loading from '@/components/Loading'
import sampleClaims from "../../data/sampleClaims.json"
import TransactionLoading from '@/components/TransactionLoading'
import ConfirmationModal from '@/components/ConfirmationModal'

const Insurance = () => {
  const {account, getAvailableInsuranceClaims, isLoading, setIsLoading, availableClaims, claimInsurance, 
    setIsTransactionLoading, isTronLinkConnected, decodeHexString, 
    isTransactionLoading, setIsConfirmationModalOpen, isConfirmationModalOpen, transactionUrl, setTransactionUrl
  } = useGlobalContext()

  useEffect(() => {
    const fetchAvailableClaims = async () => {
      if (account) { 
        setIsLoading(true)
        try {
          await getAvailableInsuranceClaims(account);
        } catch (error) {
          console.error("Failed to fetch tickets:", error);
        } finally {
          setIsLoading(false)
        }
      }
    };
    fetchAvailableClaims()
  }, [account])

  const handleClaimInsurance = async (contractAddress, tokenId) => {
    setIsTransactionLoading(true)
    if (!isTronLinkConnected()) {
      alert("Please connect your TronLink Wallet before buying ticket insurance")
      setIsTransactionLoading(false)
      return
    }

    try {
      const {success, error, result} = await claimInsurance(contractAddress, tokenId)

      if (!success){
        throw new Error(decodeHexString(error.output.contractResult[0]))
      }

      setTransactionUrl(`https://nile.tronscan.org/#/transaction/${result}`)
      setIsConfirmationModalOpen(true)
      getAvailableInsuranceClaims(account)
    } catch (err) {
      alert(`Error during transaction: ${err.message}`);
    } finally {
      setIsTransactionLoading(false)
    }
  }

  return (
    <section className="w-full flex-center flex-col pb-20">
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        url={transactionUrl}
      />
      {isLoading && <Loading/>}
      {isTransactionLoading && <TransactionLoading/>}
      <div className=' flex self-start mt-8 px-12'>
        <div className='flex flex-col items-center'>
          <h2 className="text-3xl font-bold">TICKET INSURANCE</h2>
          <div className="w-56 border-b-2 border-black mt-2"></div>
        </div>
      </div>
      <div className='w-full flex flex-col items-center justify-start'>
        {!account && "Please connect your TronLink Wallet to see your available insurance claims"}
        <br/>
        <div className="w-3/4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-white border-b border-black">
              <tr>
                <th className="px-6 py-3">Event Title</th>
                <th className="px-6 py-3">Token ID</th>
                <th className="px-6 py-3">Amount (TRX)</th>
              </tr>
            </thead>
            <tbody>
              {availableClaims.map((claim) => 
                <tr className="bg-white border-b border-black">
                  <td className="px-6 py-4">{claim.eventTitle}</td>
                  <td className="px-6 py-4">{claim.tokenId}</td>
                  <td className="px-6 py-4">{claim.refundAmount}</td>
                  <td className="px-6 py-4 text-center align-middle">
                    <button className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold p-1.5 w-20 rounded-md" onClick={() => handleClaimInsurance(claim.contractAddress, claim.tokenId)}>
                      Claim
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {availableClaims.length === 0 && "No available insurance claims to show"}
        
      </div>
    </section>
  )
}
  
  export default Insurance