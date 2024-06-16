import React, { useState } from 'react';
import { IoClose } from "react-icons/io5"; 
import { useGlobalContext } from '@/app/Context/store';
import { useQueryClient } from 'react-query';

const RedeemTicketModal = ({ tokenId, contractAddress, onClose }) => {
    const {setIsTransactionLoading, decodeHexString, getAllOwnedTokens, account, redeemTicket} = useGlobalContext()
    const [userEmail, setUserEmail] = useState()
    const [isChecked, setIsChecked] = useState(false)
    const queryClient = useQueryClient()

    // Function to stop click propagation
    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    const handleRedeemTicket = async () => {
        if (!isChecked) {
            alert("Please agree to the terms and conditions.");
            return;
        }

        if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        setIsTransactionLoading(true)

        try {
            const {success, error} = await redeemTicket(contractAddress, tokenId)
            if (!success){
                throw new Error(decodeHexString(error.output.contractResult[0]))
            }
            const response = await fetch('/api/get-ticket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({contractAddress, tokenId, userEmail})
                }
            )
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            queryClient.invalidateQueries(['tickets', account])
            alert('Ticket redeemed! Check your email for details.');
        
            setTimeout(() => {
                setIsTransactionLoading(false);
                onClose();
            }, 2000);
        } catch (error) {
            alert(`Error getting image: ${error.message}`);
            setIsTransactionLoading(false)
        }
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20" onClick={onClose}>
      <div className="bg-white p-5 rounded-lg w-1/2 h-1/2 overflow-y-auto flex flex-col" onClick={handleModalClick}>
        <div className='w-full flex justify-end'>
            <button onClick={onClose} className="text-lg self-end">
                <IoClose />
            </button>
        </div>
        
        <div className='flex flex-col w-full justify-center items-center px-2 flex-grow'>
            <div className='text-xl font-bold mt-4'>Please enter your email to confirm ticket redemption</div>
            <div className='text-sm'>Upon redemption, the unique ticket QR code will be emailed to you via the email provided. This QR code will be used for entry into the event venue. Once redeemed, the ticket CANNOT be redeemed again. Please ensure email provided is correct and DO NOT share your QR code.</div>
            <div className='text-sm mt-3 flex items-center'>
                <input type="checkbox" id="tnc" name="tnc" checked={isChecked} onChange={e => setIsChecked(e.target.checked)}/>
                <label for="tnc"> I have read and understood the terms and conditions above</label>
            </div>
            <input type='email' placeholder='Please key in your email' className="border rounded-md w-3/4 h-10 mt-5 px-3" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
            <button className='bg-yellow-300 hover:bg-yellow-400 text-black font-semibold text-lg w-28 py-1 rounded-md mt-5' onClick={handleRedeemTicket}>Redeem</button>
        </div>
      </div>
    </div>
  );
};

export default RedeemTicketModal;

