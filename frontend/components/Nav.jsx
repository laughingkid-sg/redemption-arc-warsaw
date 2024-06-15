"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoTicketOutline } from "react-icons/io5";
import { useState, useMemo, useEffect } from "react";
import { useGlobalContext } from "@/app/Context/store";

// notes about adapter:
// you can use adapter.network() to find out about the network information
// adapter.signTransaction() or signMessage() is available. likely need to look at tronWeb to see what they do

const Nav = () => {
  const { adapter, setReadyState, setAccount, setNetwork, readyState } =
    useGlobalContext();
  useEffect(() => {
    console.log(adapter);
    setReadyState(adapter.state);
    if (adapter.address != null) {
      setAccount(adapter.address);
    }

    adapter.on("connect", () => {
      setReadyState(adapter.state);
      if (adapter.address != null) {
        setAccount(adapter.address);
      }
    });

    adapter.on("readyStateChanged", (state) => {
      setReadyState(state);
    });

    adapter.on("accountsChanged", (data) => {
      console.log("detected account changed");
      setAccount(data);
    });

    adapter.on("chainChanged", (data) => {
      setNetwork(data);
    });

    adapter.on("disconnect", () => {
      console.log("disconnected");
      console.log(adapter.readyState);
      console.log(adapter.state);
      setReadyState(adapter.state);
    });
    return () => {
      // remove all listeners when components is destroyed
      adapter.removeAllListeners();
    };
  }, [adapter]);

  const pathName = usePathname(); // Use useRouter hook to get the current path

  const isActive = (pathname) => pathName === pathname;

  return (
    <div className="w-full bg-gray-800 mb-0">
      <div className="flex items-center justify-between px-4 py-2 h-full">
        <Link href="/" className="text-yellow-300 font-bold text-2xl">
          <div className="flex items-center">
            <IoTicketOutline size={30} className="mr-1" />
            NFTicket
          </div>
        </Link>
        <nav className=" h-full">
          <ul className="flex items-center space-x-4">
            <Link href="/">
              <li
                className={`${
                  isActive("/")
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                } h-full`}
              >
                Home
              </li>
            </Link>
            <Link href="/marketplace">
              <li
                className={`${
                  isActive("/marketplace")
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                } h-full`}
              >
                Marketplace
              </li>
            </Link>
            <Link href="/mytickets">
              <li
                className={`${
                  isActive("/mytickets")
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                } h-full`}
              >
                My Tickets
              </li>
            </Link>
            <Link href="/insurance">
              <li
                className={`${
                  isActive("/insurance")
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                } h-full`}
              >
                Insurance Claims
              </li>
            </Link>
            <Link href="/vr">
              <li
                className={`${
                  isActive("/vr")
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                } h-full`}
              >
                VR Experience (Beta)
              </li>
            </Link>
          </ul>
        </nav>
        <button
          className={`${
            readyState == "Disconnected"
              ? "bg-yellow-300 hover:bg-yellow-400 text-black"
              : "text-yellow-300 bg-gray-700 cursor-default"
          } px-4 py-2 rounded font-semibold`}
          onClick={() => adapter.connect()}
        >
          {readyState == "Disconnected" ? "Connect Wallet" : "Connected!"}
        </button>
      </div>
    </div>
  );
};

export default Nav;
