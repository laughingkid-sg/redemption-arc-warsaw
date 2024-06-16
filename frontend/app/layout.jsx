
import "@/styles/globals.css";
import Nav from "@/components/Nav";
import { AppProvider } from "./Context/store";

import React, { useMemo, useCallback } from "react";
import Chat from "@/components/chat/Chat";

export const metadata = {
  title: "PolChain",
  description: "NFT ticketing service for events",
};

const RootLayout = ({ children }) => {


  return (
    <html lang="en">
      <body className="font-work-sans bg-black text-white">
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
