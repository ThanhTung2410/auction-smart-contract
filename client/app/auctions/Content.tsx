"use client";

import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { useEffect, useState } from "react";
import { Auction } from "../@types/Auction.type";
import AuctionList from "./AuctionList";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Content = () => {
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletReady] = useState(false);
  const [data, setData] = useState<Auction[]>([]);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletReady(true);
    }
  }, [isLoading, wallet]);

  useEffect(() => {
    const getData = async () => {
      if (wallet) {
        const result = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_auctions",
        });

        const newResult = await Promise.all(
          result.map(async (auction: Auction) => {
            const item = await wallet.viewMethod({
              contractId: CONTRACT_ID,
              method: "get_item_metadata_by_item_id",
              args: {
                item_id: auction.item_id,
              },
            });
            let newAuction = {
              ...auction,
              item_metadata: item,
            };
            return newAuction;
          })
        );

        await setData(newResult);
        console.log(newResult);
      }
    };
    getData();
  }, [walletReady]);

  return (
    <>
      <AuctionList auctions={data} setAuctions={setData} />
    </>
  );
};

export default Content;
