"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SendHorizontalIcon, Zap } from "lucide-react";
import ChatHeader from "@/components/chat/ChatHeader";

export default function Chat() {
  const ref = useRef(null);
  const { messages, input, handleInputChange, handleSubmit, isTransactionLoading } =
    useChat({
      initialMessages: [
        {
          id: Date.now().toString(),
          role: "system",
          content:
            "You are a customer service chatbot for the website NFTicket, your answers should be short (30 words) and simple to understand.",
        },
        {
          id: Date.now().toString(),
          role: "system",
          content: `Introduction: 

                NFTicket uses NFTs to combat ticketing scams and scalping. NFTs provide security and traceability, ensuring authenticity and preventing fraud. Tickets are sold directly by organizers or on a marketplace. Smart contracts ensure secure transactions, and organizers earn from secondary sales. Scalping is reduced by limiting NFTs per wallet.	
                
                Target Audience: 
                Event goers (concerts, sports matches, conferences, conventions)
                
                Features:
                
                NFT Smart Contract
                - Deploys event contracts, manages minting, transfers ownership, and enables ticket redemption.
                - Allows trade on marketplace; tickets marked redeemed can't be reused.
                - Offers revenue potential for organizers from secondary transactions.
                
                Decentralized Marketplace:
                - Handles secondhand ticket trading with secure transactions.
                - Sellers authorize NFT transfer upon payment; commission benefits organizers.
                - Supports direct sale or auction; ensures ownership transfer on payment.
                
                Ticket Insurance:
                - Optional insurance covers cancellations; refunds portion of ticket price.
                - NFT smart contract triggers event cancellation and manages refunds.
                
                VR Concert Experience:
                - Offers virtual attendance; utilizes 360° livestreaming.
                - Provides VR-compatible experience for remote users.
                
                Pages:
                
                Initial Tickets Page:Facilitates first-hand ticket purchases; displays available events.
                Marketplace Page:Allows listing and purchase of ticket NFTs; shows transaction history.
                Your NFTickets Page: Displays user's owned tickets for convenience.
                
                Components: 
                Connect to wallet button: 
                - Located at the top right corner of website (right side on navigation bar at the top)
                - User can still navigate the website without connecting a wallet but is unable to make a purchase
                `,
        },
      ],
    });

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  return (
    <Accordion
      type="single"
      collapsible
      className="relative bg-white z-40 shadow"
    >
      <AccordionItem value="item-1">
        <div className="fixed right-8 w-80 bottom-8 bg-white border border-gray-200 rounded-md overflow-hidden'">
          <AccordionTrigger className="px-6 border-b border-zinc-300">
            <ChatHeader />
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <ScrollArea
              className="mb-2 h-80 rounded-md border px-4 w-full"
              ref={ref}
            >
              {messages.map((m) => (
                <div key={m.id} className="whitespace-pre-wrap">
                  {m.role === "user" && (
                    <div className="mb-6 flex gap-3 mt-2">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="text-gray-800 bg-yellow-300">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-1.5">
                        <p className="font-semibold">You</p>
                        <div className="mt-1.5 text-sm text-zinc-500">
                          {m.content}
                        </div>
                      </div>
                    </div>
                  )}

                  {m.role === "assistant" && (
                    <div className="mb-6 flex gap-3 mt-2">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gray-800 text-yellow-300">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-1.5 w-full">
                        <div className="flex justify-between">
                          <p className="font-semibold">Bot</p>
                        </div>
                        <div className="mt-2 text-sm text-zinc-500">
                          {m.content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>

            <form onSubmit={handleSubmit} className="relative">
              <Input
                name="message"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className="pr-12 placeholder-italic light-theme"
              />
              <Button
                size="icon"
                type="submit"
                variant="secondary"
                disabled={isTransactionLoading}
                className="absolute right-1 top-1 h-8 w-10 bg-black hover:bg-gray-500"
              >
                <SendHorizontalIcon className="h-5 w-5 text-yellow-300" />
              </Button>
            </form>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
