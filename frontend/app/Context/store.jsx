"use client"
import dynamic from 'next/dynamic'
import React, { useContext, useEffect, useState, useRef, useMemo } from "react"
import { TronLinkAdapter, WalletReadyState } from '@tronweb3/tronwallet-adapters';
import eventData from '../../data/events.json'
import { QueryClient, QueryClientProvider } from "react-query";
// import { TronWeb } from "@/tronweb"; // this imports the tronweb library from tronweb.js (not in node_modules)
// const TronWeb = require('../../tronweb')
// const TronWeb = dynamic(()=> import('../../tronweb'), {ssr:false})
import { ethers } from "ethers";

const AppContext = React.createContext()
const queryClient = new QueryClient() 

const AppProvider = (({children}) => {
    const [readyState, setReadyState] = useState();
    const [account, setAccount] = useState(''); // stores the current account connected
    const [network, setNetwork] = useState({});
    // const adapter = useMemo(() => new TronLinkAdapter(), []);
    const [myTickets, setMyTickets] = useState([])
    const [marketplaceListings, setMarketplaceListings] = useState([])
    const [availableClaims, setAvailableClaims] = useState([])
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
    const [transactionUrl, setTransactionUrl] = useState(null)

    const [isTransactionLoading, setIsTransactionLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
     const [signer, setSigner] = useState(null);

    const [tronWeb, setTronWeb] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
        setTronWeb(ethersProvider);

        const getAccount = async () => {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = ethersProvider.getSigner();
            setSigner(signer);
            const account = await signer.getAddress();
            setAccount(account);
        };

        getAccount().catch(console.error);

        window.ethereum.on("accountsChanged", async (accounts) => {
            if (accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(ethersProvider.getSigner(accounts[0]));
            } else {
            setAccount("");
            setSigner(null);
            }
        });

        window.ethereum.on("chainChanged", async (chainId) => {
            setNetwork({ chainId });
        });
        }
    }, []);

    // READ FUNCTIONS (NFT CONTRACT)

    // const getOwnedTokenIds = async (ownerAddress, contractAddress) => {
    //     if (!tronWeb) {
    //         throw new Error("tronWeb is not initialized");
    //     }
    //     const contract = await tronWeb.contract().at(contractAddress)
    //     const ownedTokens = await contract.getOwnedTokenIds(ownerAddress).call()
    //     console.log("this is owned tokens: ", ownedTokens)
    //     return ownedTokens
    // }
    const providerUrl = "https://rpc.ankr.com/avalanche_fuji";
    const abi = "";


    const getOwnedTokenIds = async (ownerAddress, contractAddress) => {
      // Connect to the Ethereum provider
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);

      // Create a new contract instance with the provider
      const contract = new ethers.Contract(contractAddress, abi, provider);

      // Ensure the contract has the function `getOwnedTokenIds`
      if (!contract.getOwnedTokenIds) {
        throw new Error("Contract does not have getOwnedTokenIds function");
      }

      // Call the function and get the owned tokens
      const ownedTokens = await contract.getOwnedTokenIds(ownerAddress);

      console.log("this is owned tokens: ", ownedTokens);
      return ownedTokens;
    };

    const getCatPrices = async (categoryId, contractAddress) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        const contract = await tronWeb.contract().at(contractAddress)
        const ticketPrice = await contract.categoryPrices(categoryId).call()
        const decimalPrice = tronWeb.toDecimal(ticketPrice._hex)
        
        console.log("selected ticket price: ", typeof decimalPrice, decimalPrice)
        return decimalPrice
    }

    const getMintLimit = async (contractAddress) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        const contract = await tronWeb.contract().at(contractAddress)
        const mintLimit = await contract.mintLimitPerAddress().call()
        const decimalLimit = tronWeb.toDecimal(mintLimit._hex)
        return decimalLimit
    }

    // function to get all the owned tokens across all event contracts
    const getAllOwnedTokens = async (userAddress) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        try {
            console.log("getAllOwnedTokens called: ", userAddress);
            setMyTickets([])
            let allNewTickets = []; // Aggregate all tickets here

            const marketplaceContract = await tronWeb.contract().at(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS)
    
            // Wait for all promises from map to resolve
            await Promise.all(eventData.map(async (event) => {
                console.log(event.eventTitle, event.contractAddress);
                const currentContractAddress = event.contractAddress;
                const contract = await tronWeb.contract().at(currentContractAddress);
                const ownedTokenIds = await contract.getOwnedTokenIds(userAddress).call();
                console.log(event.eventTitle, "tickets found: ", ownedTokenIds);
    
                // Temporary array for this contract
                let tempTickets = [];
                for (let i = 0; i < ownedTokenIds.length; i++) {
                    const currentTokenId = tronWeb.toDecimal(ownedTokenIds[i]._hex);
                    const isRedeemed = await contract.isTicketRedeemed(currentTokenId).call();
                    const isInsured = await contract.ticketInsurance(currentTokenId).call();
                    const catIndex = await contract.determineCategoryId(currentTokenId).call();
                    const catClass = tronWeb.toDecimal(catIndex) + 1;
                    const imageURL = await contract.tokenURI(currentTokenId).call();
                    const isCancelled = await contract.eventCanceled().call();
                    const isListed = await marketplaceContract.isNFTListed(currentContractAddress, currentTokenId).call()
    
                    const newTicket = {
                        "contractAddress": currentContractAddress, 
                        "eventId": event.eventId,
                        "eventTitle": event.eventTitle,
                        "date": event.date,
                        "time": event.time, 
                        "location": event.location, 
                        "tokenId": currentTokenId,
                        "isRedeemed": isRedeemed,
                        "isInsured": isInsured,
                        "catClass": catClass,
                        "imageURL": imageURL,
                        "isCancelled": isCancelled,
                        "originalTicketPrice": tronWeb.toSun(event.catPricing[catIndex]),
                        "isListed": isListed
                    };
    
                    tempTickets.push(newTicket);
                }
    
                // Combine the tickets from this iteration into the main array
                allNewTickets = allNewTickets.concat(tempTickets);
            }));
            // Now update the state once with all new tickets
            setMyTickets(allNewTickets);
            return allNewTickets
        } catch (error) {
            console.error("Error in getAllOwnedTokens: ", error);
            throw error;
        }
    }

    const isTicketRedeemed = async (contractAddress, tokenId) => {
        const contract = await tronWeb.contract().at(contractAddress)
        const isRedeemed = await contract.isTicketRedeemed(tokenId).call()
        return isRedeemed
    }

    const isTicketInsured = async (contractAddress, tokenId) => {
        const contract = await tronWeb.contract().at(contractAddress)
        const isInsured = await contract.ticketInsurance(tokenId).call()
        return isInsured
    }

    const getCategory = async (contractAddress, tokenId) => {
        const contract = await tronWeb.contract().at(contractAddress)
        const catIndex = await contract.determineCategoryId(tokenId).call()
        const catClass = catIndex + 1
        return catClass
    }

    const getTokenURI = async (contractAddress, tokenId) => {
        const contract = await tronWeb.contract().at(contractAddress)
        const imageURL = await contract.tokenURI(tokenId).call()
        return imageURL
    }

    const getSaleStartTime = async (contractAddress) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        const contract = await tronWeb.contract().at(contractAddress)
        const time = await contract.saleStartTime().call()
        return time
    }

    const isEventCanceled = async (contractAddress) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        const contract = await tronWeb.contract().at(contractAddress)
        return await contract.eventCanceled().call()
    }

    const getAvailableInsuranceClaims = async (userAddress) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        try {
            setAvailableClaims([]);
            let allNewClaims = [];
    
            const marketplaceContract = await tronWeb.contract().at(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS);
    
            // Use for...of instead of map for better handling of asynchronous operations
            for (let event of eventData) {
                console.log(event.eventTitle, event.contractAddress);
                const currentContractAddress = event.contractAddress;
                const contract = await tronWeb.contract().at(currentContractAddress);
    
                // Check if the event is cancelled and proceed only if true
                if (!await contract.eventCanceled().call()) {
                    continue; // Skip to the next iteration if the event is not canceled
                }
    
                const insuredTokenIds = await contract.getInsuredTokenIds(userAddress).call();
                console.log(event.eventTitle, "Claims found: ", insuredTokenIds);
    
                let tempClaims = [];
                for (let i = 0; i < insuredTokenIds.length; i++) {
                    const currentTokenId = tronWeb.toDecimal(insuredTokenIds[i]._hex);
                    const isInsured = await contract.ticketInsurance(currentTokenId).call();
                    const catIndex = await contract.determineCategoryId(currentTokenId).call();
                    const catClass = tronWeb.toDecimal(catIndex) + 1;
                    const isCancelled = true;
    
                    const originalTicketPrice = Number(tronWeb.toSun(event.catPricing[catIndex])); // returns string
                    const insurancePaid = (20 / 100) * originalTicketPrice;
                    const refundAmount = tronWeb.fromSun(originalTicketPrice + insurancePaid);
    
                    const newClaim = {
                        "contractAddress": currentContractAddress,
                        "eventId": event.eventId,
                        "eventTitle": event.eventTitle,
                        "date": event.date,
                        "time": event.time,
                        "location": event.location,
                        "tokenId": currentTokenId,
                        "isInsured": isInsured,
                        "catClass": catClass,
                        "isCancelled": isCancelled,
                        "refundAmount": refundAmount
                    };
    
                    tempClaims.push(newClaim);
                }
    
                allNewClaims = allNewClaims.concat(tempClaims);
            }
            setAvailableClaims(allNewClaims);
        } catch (error) {
            console.error("Error in getAvailableInsuranceClaims: ", error);
            throw error;
        }
    }

    const loadEventPageData = async (contractAddress) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        // get the mint limit
        const contract = await tronWeb.contract().at(contractAddress)
        const mintLimit = await contract.mintLimitPerAddress().call()
        const decimalLimit = tronWeb.toDecimal(mintLimit._hex)
        // get the event cancelled
        const isCancelled = await contract.eventCanceled().call()
        // get sale start time
        const saleTime = await contract.saleStartTime().call()

        return {mintLimit: decimalLimit, isCancelled, startTime: saleTime}
    }

    // READ FUNCTIONS (MARKETPLACE CONTRACT)

    const getAllActiveListings = async () => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        console.log("getAllActiveListings called!");
        try {
            const contractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS;
            const contract = await tronWeb.contract().at(contractAddress);
            const allActiveListingsTmp = await contract.getAllActiveListings().call();

    
            const [ids, sellers, contracts, tokenIds, listingPrices, actives] = allActiveListingsTmp;
    
            const allActiveListings = ids.map((id, index) => ({
                listingId: tronWeb.toDecimal(id._hex),
                sellerAddress: tronWeb.address.fromHex(sellers[index]),
                nftContractAddress: tronWeb.address.fromHex(contracts[index]),
                tokenId: tronWeb.toDecimal(tokenIds[index]),
                listingPrice: tronWeb.toDecimal(listingPrices[index]),
                isActive: actives[index],
            }));
    
            // Sort listings by nftContractAddress
            allActiveListings.sort((a, b) => a.nftContractAddress.localeCompare(b.nftContractAddress));
            
            let currentContractInstance = null;
            let currentContractAddress = "";
            let event = null
            let listingsList = []
    
            for (const listing of allActiveListings) {
                if (listing.nftContractAddress !== currentContractAddress) {
                    currentContractInstance = await tronWeb.contract().at(listing.nftContractAddress);
                    currentContractAddress = listing.nftContractAddress;

                    event = eventData.find(event => event.contractAddress === currentContractAddress)
                }
                const newListingInfo = {
                    "listingId": listing.listingId,
                    "sellerAddress": listing.sellerAddress,
                    "nftContractAddress": currentContractAddress,
                    "tokenId": listing.tokenId,
                    "listingPrice": tronWeb.fromSun(listing.listingPrice),
                    "isActive": listing.isActive,

                    "eventTitle": event.eventTitle,
                    "date": event.date,
                    "time": event.time,
                    "location": event.location, 
                    "eventDescription": event.description,

                    "isRedeemed": await currentContractInstance.isTicketRedeemed(listing.tokenId).call(),
                    "isInsured": await currentContractInstance.ticketInsurance(listing.tokenId).call(),
                    "catClass": parseInt(await currentContractInstance.determineCategoryId(listing.tokenId).call()) + 1,
                    "tokenImgURL": await currentContractInstance.tokenURI(listing.tokenId).call(),
                    "isCancelled": await currentContractInstance.eventCanceled().call()
                }
                listingsList.push(newListingInfo)
            }
            
            setMarketplaceListings(listingsList)
        } catch (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }
    }

    const isTicketListed = async (nftContractAddress, tokenId) => {
        const contract = await tronWeb.contract().at(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS)
        return await contract.isNFTListed(nftContractAddress, tokenId).call()
    }

    // WRITE FUNCTIONS (NFT CONTRACT)

    const mintTicket = async (categoryId, quantity, fee, contractAddress) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        try {
            const contract = await tronWeb.contract().at(contractAddress)
            const result = await contract.mintTicket(categoryId, quantity).send({
                feeLimit: 1000000000,
                callValue: fee * quantity,
                // shouldPollResponse: true
            })
            console.log(result)
            return {success: true, result}
        } catch (error) {
            console.log("Error minting ticket: ", error)
            return { success: false, error }
        }
    }

    const buyInsurance = async (contractAddress, tokenId, originalTicketPrice) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        try {
            const contract = await tronWeb.contract().at(contractAddress)
            const insurancePrice = Number(originalTicketPrice) * 20/100
            const result = await contract.buyInsurance(tokenId).send({
                feeLimit: 1000000000,
                callValue: insurancePrice,
                // shouldPollResponse: true
            })
            console.log("buy ticket insurance: ", result)
            return {success: true, result}
        } catch (error) {
            console.log("Error buying ticket insurance: ", error)
            return { success: false, error }
        }
    }

    const redeemTicket = async (contractAddress, tokenId) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        try {
            const contract = await tronWeb.contract().at(contractAddress)
            const result = await contract.redeemTicket(tokenId).send({
                feeLimit: 1000000000,
                callValue: 0,
                // shouldPollResponse: true
            })
            console.log("redeem ticket: ", result)
            return {success: true, result}
        } catch (error) {
            console.log("Error redeeming ticket: ", error)
            return { success: false, error }
        }
    }

    const claimInsurance = async (contractAddress, tokenId) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        try {
            const contract = await tronWeb.contract().at(contractAddress)
            const result = await contract.claimRefund(tokenId).send({
                feeLimit: 1000000000,
                callValue: 0,
                // shouldPollResponse: true
            })
            console.log("Claim refund: ", result) // result is the transaction hash
            return {success: true, result}
        } catch (error) {
            console.log("Error claiming refund: ", error)
            return { success: false, error }
        }
    }

    // WRITE FUNCTIONS (MARKETPLACE CONTRACT)

    const listTicket = async (contractAddress, tokenId, listedTRXPrice) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        const listedSunPrice = tronWeb.toSun(listedTRXPrice)
        try {
            const contract = await tronWeb.contract().at(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS)
            const result = await contract.listNFT(contractAddress, tokenId, listedSunPrice).send({
                feeLimit: 1000000000,
                callValue: 0, 
            })
            console.log("List ticket: ", result)
            return {success: true, result}
        } catch (error) {
            console.log("Error listing ticket: ", error)
            return { success: false, error }
        }

    }

    const buyTicket = async (listingId, listedPrice) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        try {
            const contract = await tronWeb.contract().at(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS)
            const result = await contract.buyNFT(listingId).send({
                feeLimit: 1000000000,
                callValue: tronWeb.toSun(listedPrice), 
            })
            console.log("Buy resale ticket: ", result)
            return {success: true, result}
        } catch (error) {
            console.log("Error buying resale ticket: ", error)
            return { success: false, error }
        }
    }

    const approveNFTContractToMarketplace = async (contractAddress, tokenId) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        try {
            const contract = await tronWeb.contract().at(contractAddress)
            const result = await contract.approve(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS, tokenId).send({
                feeLimit: 1000000000,
                callValue: 0, 
            })
            console.log("Approve marketplace contract for token: ", result)
            return {success: true, result}
        } catch (error) {
            console.log("Approval error: ", error)
            return { success: false, error }
        }

    }

    // UTILITY FUNCTIONS

    const isTronLinkConnected = async () => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        // console.log("tronweb connection: ", await tronWeb.isConnected())

        if (tronWeb) {
            return true
        }
        else {
            return false
        }
    }

    const decodeHexString = (hexString) => {
        if (!tronWeb) {
            throw new Error("tronWeb is not initialized");
        }
        const data = hexString.slice(8); // Remove the function selector
        const decodedString = tronWeb.toUtf8(data);
        const strippedString = decodedString.replace(/[\u0000-\u001F]+/g, ''); // Remove null padding
        return strippedString.trim(); // Additionally, trim any whitespace from both ends of the string
    }

    const updateTicketStatus = (tokenId, updatedFields) => {
        setMyTickets(currentTickets => {
            return currentTickets.map(ticket =>
            ticket.tokenId === tokenId ? { ...ticket, ...updatedFields } : ticket
            );
        });
    };

    return(
        <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={{
                tronWeb, 
                // adapter, 
                readyState, account, network, isTransactionLoading, myTickets, marketplaceListings, isLoading, availableClaims, isConfirmationModalOpen, transactionUrl,
                setReadyState, setAccount, setNetwork, setIsTransactionLoading, setMyTickets, setMarketplaceListings, setIsLoading, setAvailableClaims, setIsConfirmationModalOpen, setTransactionUrl, 
                getOwnedTokenIds, getCatPrices, getMintLimit, getAllOwnedTokens, getAllActiveListings, isEventCanceled, getAvailableInsuranceClaims, getSaleStartTime, loadEventPageData,
                mintTicket, buyInsurance, redeemTicket, listTicket, updateTicketStatus, approveNFTContractToMarketplace, buyTicket, claimInsurance,
                decodeHexString, isTronLinkConnected
            }}>
                {children}
            </AppContext.Provider>
        </QueryClientProvider>
    )
})

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }