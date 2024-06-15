
import "@/styles/globals.css";
import Nav from "@/components/Nav";
import { AppProvider } from "./Context/store";

import React, { useMemo, useCallback } from "react";
import {
  TronLinkAdapter,
  WalletReadyState,
} from "@tronweb3/tronwallet-adapters";
import {
  useWallet,
  WalletProvider,
} from "@tronweb3/tronwallet-adapter-react-hooks";
import { WalletModalProvider } from "@tronweb3/tronwallet-adapter-react-ui";
import {
  WalletDisconnectedError,
  WalletError,
  WalletNotFoundError,
} from "@tronweb3/tronwallet-abstract-adapter";
import Chat from "@/components/chat/Chat";

export const metadata = {
  title: "NFTicket",
  description: "NFT ticketing service for events",
};

const RootLayout = ({ children }) => {
  // const adapters = useMemo(() => [new TronLinkAdapter()]);
  // const onAccountsChanged = useCallback((curAddr, preAddr) => {
  //     console.log('new address is: ', curAddr, ' previous address is: ', preAddr);
  // }, []);

  return (
    <html lang="en">
      <body className="">
        {/* <WalletProvider adapters={adapters} onAccountsChanged={onAccountsChanged}> */}
          <AppProvider>
            <div className="main">
              <Nav/>
              {children}
              <Chat/>
            </div>
          </AppProvider>
        {/* </WalletProvider> */}
      </body>
    </html>
  );
};

export default RootLayout;
