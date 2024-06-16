"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoTicketOutline } from "react-icons/io5";
import { useState, useMemo, useEffect } from "react";
import { useGlobalContext } from "@/app/Context/store";
const ethers = require("ethers");


const Nav = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    // Check if user is already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };

    checkConnection();

    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const pathName = usePathname(); // Use useRouter hook to get the current path

  const isActive = (pathname) => pathName === pathname;

  return (
    <div className="w-full bg-gray-800 mb-0">
      <div className="flex items-center justify-between px-4 py-4 h-full">
        <Link
          href="/"
          className="text-yellow-300 font-bold text-2xl">
          <div className="flex items-center">
            <IoTicketOutline
              size={30}
              className="mr-1"
            />
            PolChain
          </div>
        </Link>
        <nav className=" h-full">
          <ul className="flex items-center space-x-4">
            <Link href="/">
              <li
                className={`${
                  isActive("/") ? "text-white font-semibold" : "text-white hover:text-yellow-300"
                } h-full`}>
                Home
              </li>
            </Link>
            <Link href="/marketplace">
              <li
                className={`${
                  isActive("/marketplace")
                    ? "text-white font-semibold"
                    : "text-white hover:text-yellow-300"
                } h-full`}>
                Marketplace
              </li>
            </Link>
            <Link href="/mytickets">
              <li
                className={`${
                  isActive("/mytickets")
                    ? "text-white font-semibold"
                    : "text-white hover:text-yellow-300"
                } h-full`}>
                My Tickets
              </li>
            </Link>
            <Link href="/insurance">
              <li
                className={`${
                  isActive("/insurance")
                    ? "text-white font-semibold"
                    : "text-white hover:text-yellow-300"
                } h-full`}>
                Insurance Claims
              </li>
            </Link>
            <Link href="/vr">
              <li
                className={`${
                  isActive("/vr") ? "text-white font-semibold" : "text-white hover:text-yellow-300"
                } h-full`}>
                VR Experience (Beta)
              </li>
            </Link>
          </ul>
        </nav>
        {account ? (
          <div className="text-black bg-yellow-300 rounded-md p-2">
            <p>
              <b>Connected Account</b>
            </p>
            <div className="text-right max-h-[50px] overflow-x-auto overflow-y-hidden whitespace-nowrap ">
              <p>{account}</p>
            </div>
          </div>
        ) : (
          <button
            className={`${
              account == "Disconnected"
                ? "bg-yellow-300 hover:bg-yellow-400 text-black"
                : "text-yellow-300 bg-gray-700 cursor-default"
            } px-4 py-2 rounded font-semibold`}
            onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Nav;
