"use client";

import styled from "styled-components";
import { Item } from "../@types/Item.type";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { Auction } from "../@types/Auction.type";
import Title from "../components/Title";
import CountdownTimer from "../components/CountdownTimer/CountdownTimer";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Cards = styled.div`
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 4rem;
`;

const Card = styled.div`
  width: 25%;
  min-width: 250px;
  display: flex;
  flex-flow: column nowrap;
  -ms-flex-flow: column nowrap;
  align-items: center;
  //  background-color:#09011a;
  border-radius: 10px;
  border: 1.41429px solid rgba(28, 27, 28, 0.1);
  box-shadow: 5.65714px 5.65714px 11.3143px rgba(28, 27, 28, 0.04);
  padding: 8px;
  //  color: #fff;
  margin: 0 auto;
  max-width: 400px;
  flex: 1;
  &:hover img {
    transform: scale(1.05);
  }
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }
`;

const CardHeading = styled.h5`
  font-size: 1.25rem;
  font-weight: 500;
  color: #09011a;
`;

const Text = styled.div`
  opacity: 0.6;
`;

const ImageCard = styled.div`
  height: 200px;
  width: 100%;
  border-radius: inherit;
  overflow: hidden;
  margin-bottom: 0.5rem;
  & > img {
    object-fit: cover;
    transition: all 0.3s ease-in-out;
  }
  & > img:hover {
    transform: scale(1.05);
  }
`;

interface AuctionListProps {
  auctions: Auction[];
  setAuctions: Dispatch<SetStateAction<Auction[]>>;
}

export default function AuctionList(props: AuctionListProps) {
  const { auctions, setAuctions } = props;
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletready] = useState(false);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletready(true);
    }
  }, [isLoading, wallet]);

  const finishDeleteItem = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletready(false);
    e.preventDefault();

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "delete_auction",
        args: { item_id: currentItem?.item_id },
        gas: "300000000000000",
      })
      .then(() => setWalletready(true))
      .then(() => setCurrentItem(null))
      .then(() => {
        window.location.reload();
      });
  };

  // const startDeleteItem = (itemId: number) => {
  //   let itemFound = items.find((item) => item.item_id === itemId);
  //   if (itemFound) {
  //     setCurrentItem(itemFound);
  //   }
  //   setIsShowModal(true);
  // };

  return (
    <>
      <Title name="List Auctions" />
      <Cards>
        {auctions.map((auction) => (
          <Card key={auction.auction_id}>
            <ImageCard>
              <a href={"/auctions/detail?id=" + auction.auction_id}>
                <img src={auction?.item_metadata?.media} alt="..." />
              </a>
            </ImageCard>
            <div className="card-body p-2 mt-3">
              <CardHeading>{auction.item_metadata.name}</CardHeading>
              <Text className="ps-2  pb-3 text-secondary">
                {auction.item_metadata.description} Host: {auction.host_id}
              </Text>
            </div>

            <CountdownTimer />

            {account !== auction.host_id ? (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Auction
              </button>
            ) : (
              ""
            )}

            {account === auction.host_id ? (
              <button
                // onClick={() => {
                //   startDeleteItem(item.item_id);
                // }}
                className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            ) : (
              ""
            )}
          </Card>
        ))}
      </Cards>
      {/* <Modal
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        finishDeleteItem={finishDeleteItem}
      /> */}
    </>
  );
}
