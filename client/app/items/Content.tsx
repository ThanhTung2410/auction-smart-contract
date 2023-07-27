"use client";

import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { useEffect, useState } from "react";
import { Item } from "../@types/Item.type";
import ItemList from "./ItemList";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Content = () => {
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletReady] = useState(false);
  const [data, setData] = useState<Item[]>([]);
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
          method: "get_all_items_per_user_own",
          args: {
            user_id: account,
          },
        });
        setData(result);
        console.log(result);
      }
    };
    getData();
  }, [walletReady]);

  const changeMessage = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletReady(false);
    e.preventDefault();
    let { numberInput } = e.target.elements;
    let parsedValue = parseInt(numberInput.value);

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "plus",
        args: { number: parsedValue },
        gas: "300000000000000",
      })
      .then(() => setWalletReady(true))
      .then(() => window.location.reload());
  };

  return (
    <>
      <ItemList items={data} setItems={setData} />
    </>
  );
};

export default Content;
