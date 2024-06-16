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
import nftTicketABI from "../../data/nfticketABI.json";
import marketplaceABI from "../../data/marketplaceABI.json";

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
        console.log("ethersProvider: ", ethersProvider);

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


    const providerUrl = "https://api.avax-test.network/ext/bc/C/rpc";

    const getOwnedTokenIds = async (ownerAddress, contractAddress) => {
      // Connect to the Ethereum provider
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);

      // Create a new contract instance with the provider
      const contract = new ethers.Contract(contractAddress, nftTicketABI, provider);

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

    const getAllOwnedTokens = async (userAddress) => {
      if (!window.ethereum) {
        throw new Error("Ethereum provider is not initialized");
      }

      try {
        console.log("getAllOwnedTokens called: ", userAddress);
        setMyTickets([]);
        let allNewTickets = []; // Aggregate all tickets here

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const marketplaceContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS,
          marketplaceABI, // Define marketplaceAbi appropriately
          signer
        );

        // Wait for all promises from map to resolve
        await Promise.all(
          eventData.map(async (event) => {
            console.log(event.eventTitle, event.contractAddress);
            const currentContractAddress = event.contractAddress;
            const contract = new ethers.Contract(
              currentContractAddress,
              nftTicketABI, // Define eventAbi appropriately
              signer
            );
            const ownedTokenIds = await contract.getOwnedTokenIds(userAddress);

            console.log(event.eventTitle, "tickets found: ", ownedTokenIds);

            // Temporary array for this contract
            let tempTickets = [];
            for (let i = 0; i < ownedTokenIds.length; i++) {
              const currentTokenId = ethers.BigNumber.from(ownedTokenIds[i]).toNumber();
              const isRedeemed = await contract.isTicketRedeemed(currentTokenId);
              const isInsured = await contract.ticketInsurance(currentTokenId);
              const catIndex = await contract.determineCategoryId(currentTokenId);
              const catClass = ethers.BigNumber.from(catIndex).toNumber() + 1;
              const imageURL = await contract.tokenURI(currentTokenId);
              const isCancelled = await contract.eventCanceled();
              const isListed = await marketplaceContract.isNFTListed(
                currentContractAddress,
                currentTokenId
              );

              const newTicket = {
                contractAddress: currentContractAddress,
                eventId: event.eventId,
                eventTitle: event.eventTitle,
                date: event.date,
                time: event.time,
                location: event.location,
                tokenId: currentTokenId,
                isRedeemed: isRedeemed,
                isInsured: isInsured,
                catClass: catClass,
                imageURL: imageURL,
                isCancelled: isCancelled,
                originalTicketPrice: ethers.utils.formatUnits(event.catPricing[catIndex], "wei"),
                isListed: isListed,
              };

              tempTickets.push(newTicket);
            }

            // Combine the tickets from this iteration into the main array
            allNewTickets = allNewTickets.concat(tempTickets);
          })
        );

        // Now update the state once with all new tickets
        setMyTickets(allNewTickets);
        return allNewTickets;
      } catch (error) {
        console.error("Error in getAllOwnedTokens: ", error);
        throw error;
      }
    };

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

    const loadEventPageData = async (contractAddress, abi) => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed");
    }

      try {
        
        const contract = new ethers.Contract(
          "0xbc1f9A4a1C946a1cF5FB2A7922327469B3E9D3f0",
          nftTicketABI, // Define eventAbi appropriately
          signer
        );
        console.log("contract: ", contract);
        // Get the mint limit
        const mintLimit = await contract.mintLimitPerAddress();
        const decimalLimit = mintLimit.toNumber(); // Assuming mintLimit is a BigNumber

        // Get the event canceled status
        const isCancelled = await contract.eventCanceled();

        // Get the sale start time
        const saleTime = await contract.saleStartTime();

        return { mintLimit: decimalLimit, isCancelled, startTime: saleTime };
      } catch (error) {
        console.error("Error loading event page data: ", error);
        return { success: false, error };
      }
    };

    // const loadEventPageData = async (contractAddress) => {
    //     if (!tronWeb) {
    //         throw new Error("tronWeb is not initialized");
    //     }
    //     // get the mint limit
    //     const contract = await tronWeb.contract().at(contractAddress)
    //     const mintLimit = await contract.mintLimitPerAddress().call()
    //     const decimalLimit = tronWeb.toDecimal(mintLimit._hex)
    //     // get the event cancelled
    //     const isCancelled = await contract.eventCanceled().call()
    //     // get sale start time
    //     const saleTime = await contract.saleStartTime().call()

    //     return {mintLimit: decimalLimit, isCancelled, startTime: saleTime}
    // }

    // READ FUNCTIONS (MARKETPLACE CONTRACT)

    const getAllActiveListings = async () => {
      if (!window.ethereum) {
        throw new Error("Ethereum provider is not initialized");
      }
      console.log("getAllActiveListings called!");
      try {
        const contractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const marketplaceContract = new ethers.Contract(
          contractAddress,
          marketplaceABI, // Define marketplaceAbi appropriately
          signer
        );

        // Get all active listings
        const allActiveListingsTmp = await marketplaceContract.getAllActiveListings();
        console.log(allActiveListingsTmp);

        // Destructure the result into individual arrays
        const [ids, sellers, contracts, tokenIds, listingPrices, actives] = allActiveListingsTmp;

        // Map to format the listings
        const allActiveListings = ids.map((id, index) => ({
          listingId: id.toNumber(), // Convert BigNumber to number
          sellerAddress: sellers[index],
          nftContractAddress: contracts[index],
          tokenId: tokenIds[index].toNumber(), // Convert BigNumber to number
          listingPrice: ethers.utils.formatUnits(listingPrices[index], "wei"), // Convert from wei to Ether
          isActive: actives[index],
        }));

        // Sort listings by nftContractAddress
        allActiveListings.sort((a, b) => a.nftContractAddress.localeCompare(b.nftContractAddress));

        let currentContractInstance = null;
        let currentContractAddress = "";
        let event = null;
        let listingsList = [];

        // Fetch event details for each listing
        for (const listing of allActiveListings) {
          if (listing.nftContractAddress !== currentContractAddress) {
            const event = eventData.find(
              (event) => event.contractAddress === listing.nftContractAddress
            );
            currentContractInstance = new ethers.Contract(
              listing.nftContractAddress,
              nftTicketABI, // Define eventAbi appropriately
              signer
            );
            currentContractAddress = listing.nftContractAddress;
          }

          const newListingInfo = {
            listingId: listing.listingId,
            sellerAddress: listing.sellerAddress,
            nftContractAddress: currentContractAddress,
            tokenId: listing.tokenId,
            listingPrice: ethers.utils.formatUnits(listing.listingPrice, "ether"), // Convert from wei to Ether
            isActive: listing.isActive,

            eventTitle: event.eventTitle,
            date: event.date,
            time: event.time,
            location: event.location,
            eventDescription: event.description,

            // Call contract methods to get additional listing info
            isRedeemed: await currentContractInstance.isTicketRedeemed(listing.tokenId),
            isInsured: await currentContractInstance.ticketInsurance(listing.tokenId),
            catClass:
              (await currentContractInstance.determineCategoryId(listing.tokenId)).toNumber() + 1,
            tokenImgURL: await currentContractInstance.tokenURI(listing.tokenId),
            isCancelled: await currentContractInstance.eventCanceled(),
          };

          listingsList.push(newListingInfo);
        }

        // Update state or do further processing with listingsList
        setMarketplaceListings(listingsList);
      } catch (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }
    };

    const isTicketListed = async (nftContractAddress, tokenId) => {
        const contract = await tronWeb.contract().at(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS)
        return await contract.isNFTListed(nftContractAddress, tokenId).call()
    }

    // WRITE FUNCTIONS (NFT CONTRACT)

    const mintTicket = async (
    categoryId,
    quantity,
    fee,
    contractAddress,
    ) => {
    // Connect to the Ethereum provider
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    // Create a new contract instance with the wallet (which includes signing capabilities)
     const contract = new ethers.Contract(contractAddress, abi, signer);
    // const contract = new ethers.Contract(contractAddress, marketplaceABI, wallet);

    try {
        // Estimate the gas limit for the transaction
        const gasLimit = await contract.estimateGas.mintTicket(categoryId, quantity, {
        value: ethers.utils.parseUnits((fee * quantity).toString(), "wei"),
        });

        // Call the mintTicket function
        const tx = await contract.mintTicket(categoryId, quantity, {
        value: ethers.utils.parseUnits((fee * quantity).toString(), "wei"),
        gasLimit: gasLimit,
        // gasPrice: ethers.utils.parseUnits('20', 'gwei'), // optionally specify the gas price
        });

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        console.log(receipt);
        return { success: true, receipt };
    } catch (error) {
        console.log("Error minting ticket: ", error);
        return { success: false, error };
    }
    };

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