"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { Auction } from "@/app/@types/Auction.type";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Root = styled.div`
  color: black; // hard code
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  align-items: center;
  justify-content: center;
`;
const MainContainer = styled.div`
  padding: 30px;
  height: auto;
  max-width: 1300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  @media screen and (max-width: 600px) {
    justify-content: center;
    align-items: center;
  }
`;

const TopImageContainer = styled.div`
  padding: 1em;
  background: #ffffff;
  width: 40%;
  min-width: 355px;
  border: 2px solid #cacdd5;
  margin-right: 40px;
  box-shadow: 2px 7px 22px rgba(28, 27, 28, 0.1);
  border-radius: 0.7em;
  & > img {
    width: 100%;
    max-height: 548px;
  }
`;

const HeaderText = styled.h1`
  font-size: 1.5rem;
`;

const PriceArea = styled.div`
  display: flex;
  align-items: center;
  color: #0d99ff;
  & > * {
    margin: 0px;
    padding: 0px;
  }
  & > h6 {
    font-weight: 700;
    margin-left: 5px;
    margin-top: 4px;
    margin-right: 3px;
    font-size: 1.3rem;
  }
  & > span {
    font-size: 1.2rem;
    margin: 0px;
  }
`;

const PriceBucket = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 30px;
  width: 100%;
`;

const RightSection = styled.div`
  width: 46%;
  min-width: 350px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;
`;

const Description = styled.div`
  width: 100%;
  border-radius: 1em;
  background: #ffffff;
  border: 2px solid #eeeff2;
  padding: 1em;
  margin-top: 40px;
  box-shadow: 2px 7px 22px rgba(28, 27, 28, 0.1);
  & > h6 {
    font-weight: 600;
    font-size: 1.5rem;
  }
`;

const AttributeContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Attribute = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.5em;
  border-radius: 0.5em;
  width: 206px;
  background: #fafafb;
  margin-bottom: 20px;
  border: 1px solid #86ccff;
  border-radius: 10.6849px;
  & > *span {
    padding: 0;
    color: #b2b7c2;
  }
`;

const TransactionTable = styled.div`
  width: 100%;
  max-width: 70%;
  background: #ffffff;
  border: 2px solid #eeeff2;
  box-shadow: 2px 7px 22px rgba(28, 27, 28, 0.1);
  border-radius: 16px;
  margin-bottom: 40px;
`;

const TableHeader = styled.div`
  width: 100%;
  padding: 0.5em;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 0.5em;
  display: flex;
  justify-content: flex-start;
  gap: 1em;
  background: #f5f6f7;
  border-radius: 14px 14px 0px 0px;
  & > h1 {
    font-size: 24px;
  }
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5em;
  justify-content: space-between;
  border-bottom: 1px solid #dde1e6;
  a {
    cursor: pointer;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    padding-left: 7px;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    span {
      font-size: 12px;
    }
  }
`;

const RowType = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5em;
  font-size: 0.75rem;
  padding: 0.25em 1em;
  border-radius: 0.7em;
  border: 1px solid #a4a9b6;
`;

const RowBody = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding-left: 7px;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  span {
    font-size: 12px;
  }
`;

const MintDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #525c76;
  & > span {
    font-size: 14px;
  }
  & > a {
    cursor: pointer;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px); /* Apply background blur */
`;

const PopupContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  align-items: center;
  max-width: 350px;
  display: flex;
  justify-content: center;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #0d99ff;
  color: white;
  padding: 5px 15px;
  border: none;
  margin-top: 20px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const CloseNFT = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: flex-start !important;
  justify-content: space-between !important;
  img {
    width: 40px;
    cursor: pointer;
    align-self: flex-start;
  }
`;

const CloseButton = styled.button`
  background-color: white;
  color: #0d99ff;
  margin-top: 20px;
  padding: 5px 15px;
  border: 1px solid #0d99ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const MarketplaceListed = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  & > span {
    font-size: 14px;
    color: #525c76;
  }
  & > p {
    margin: 0;
    font-size: 14px;
  }
`;

// const getUsdValue = (price) => {
//   const res = fetch(
//     `https://api.coingecko.com/api/v3/simple/price?ids=${
//       currentChain[props.state.singleNftProps.chain].livePrice
//     }&vs_currencies=usd`
//   );
//   if (res.ok) {
//     const multiplyBy = Object.values(res?.body)[0]?.usd;
//     const value = multiplyBy * price.toFixed(2);
//     console.log(value.toFixed(4));
//     return value.toFixed(4) !== "NaN" ? value.toFixed(4) : 0;
//   }
// };

// const handleBuyClick = () => {
//   const contract = new ethers.Contract(
//     currentChain[props.state.singleNftProps.chain].contract,
//     listAbi,
//     Ethers.provider().getSigner()
//   );

//   const nftContract = props.state.singleNftProps.id.split(
//     props.state.singleNftProps.tokenId
//   )[0];

//   console.log("trying to buy oo");
//   console.log(
//     "variab;es",
//     currentChain[props.state.singleNftProps.chain].contract,
//     nftContract,
//     contract
//   );

//   contract
//     .nftSale(
//       props.state.singleNftProps.price,
//       props.state.singleNftProps.tokenId,
//       props.state.singleNftProps.owner,
//       nftContract,
//       { value: props.state.singleNftProps.price }
//     )
//     .then((transactionHash) => transactionHash.wait())
//     .then((ricit) => {
//       console.log("does not get hiere", ricit);
//       State.update({
//         message: true,
//         text: `${currentChain[props.state.singleNftProps.chain].explorer}/tx/${
//           ricit.transactionHash
//         }`,
//       });
//       props.handleCloseNft();
//     })
//     .catch((err) => {
//       State.update({
//         error: true,
//         text: err.reason,
//       });
//     });
// };

// const handleSendClick = () => {
//   // Handle the send button click event
//   console.log("Input value:", state.listingPrice, Number(state.listingPrice));
//   console.log(
//     "Input value:",
//     Ethers.provider().getSigner(),
//     currentChain[props.state.singleNftProps.chain].contract
//   );
//   const contract = new ethers.Contract(
//     currentChain[props.state.singleNftProps.chain].contract,
//     listAbi,
//     Ethers.provider().getSigner()
//   );
//   console.log("Formed thee", contract);
//   const nftContract = props.state.singleNftProps.id.split(
//     props.state.singleNftProps.tokenId
//   )[0];

//   console.log(
//     "Logged Thee",
//     nftContract,
//     props.state.singleNftProps.tokenId,
//     (Number(state.listingPrice) * 1e18).toString()
//   );

//   contract
//     .createMarketplaceItem(
//       nftContract,
//       props.state.singleNftProps.tokenId,
//       (Number(state.listingPrice) * 1e18).toString(),
//       "General",
//       "0xB4bE310666D2f909789Fb1a2FD09a9bEB0Edd99D"
//     )
//     .then((transactionHash) => transactionHash.wait())
//     .then((ricit) => {
//       console.log("does not get hiere", ricit);
//       State.update({
//         isOpen: false,
//         message: true,
//         text: `${currentChain[props.state.singleNftProps.chain].explorer}/tx/${
//           ricit.transactionHash
//         }`,
//       });
//     })
//     .catch((err) => {
//       console.log("erro stuffs, baffles me", err);
//       State.update({
//         isOpen: false,
//         error: true,
//         text: err.reason,
//       });
//     });
// };

// const handleListing = () => {
//   State.update({
//     isOpen: true,
//   });
// };

// const handleInputChange = (e) => {
//   console.log("updator", e.target.value);
//   State.update({
//     listingPrice: e.target.value,
//   });
// };

// const price = props.state.singleNftProps.price
//   ? props.state.singleNftProps.price * PRICE_CONVERSION_VALUE
//   : 0;

// const handleClose = () => {
//   props.isNFTButtonClicked = false;
// };

export default function page() {
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [bid, setBid] = useState<number>(0);
  const [auction, setAuction] = useState<Auction | null>(null);
  const [walletReady, setWalletReady] = useState(false);
  const isLoading = useAppSelector(selectIsLoading);

  const searchParams = useSearchParams();

  const id = parseInt(searchParams.get("id"));

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
          method: "get_auction_metadata_by_auction_id",
          args: {
            auction_id: id,
          },
        });

        const item = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_item_metadata_by_item_id",
          args: {
            item_id: result?.item_id,
          },
        });

        let newResult: Auction = {
          ...result,
          item_metadata: item,
        };

        await setAuction(newResult);
        console.log(newResult);
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

    const tenPow24 = "000000000000000000000000";
    const bidInYoctoNear = bid + tenPow24;

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "join_auction",
        args: { auction_id: id },
        deposit: bidInYoctoNear,
        gas: "300000000000000",
      })
      .then(() => setWalletReady(true))
      .then(() => window.location.reload());
  };

  const handleChange = (event: any) => {
    setBid(event.target.value);
  };

  return (
    <Root>
      <MainContainer>
        <TopSection>
          <CloseNFT
          //   onClick={() => props.handleCloseNft()}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/256/109/109618.png"
              alt=""
            />
          </CloseNFT>
          <TopImageContainer>
            <HeaderText>
              {/* hard code for text */}
              {auction?.item_metadata.name}
            </HeaderText>
            <img
              src={auction?.item_metadata.media}
              alt="NFT"
              width="100%"
              height="100%"
              className="rounded-3"
            />
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  marginBottom: "0.5em",
                  fontSize: "0.85rem",
                  color: "#0d99ff",
                }}
              >
                Host by
              </p>
              <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                {auction?.host_id}
              </span>
            </div>
          </TopImageContainer>
          <RightSection>
            {/* {state.error && (
              <span style={{ color: state.colour || "red" }}>{state.text}</span>
            )} */}
            {/* {state.message && (
              <a href={`${state.text}`} target="_blank">
                View Transaction
              </a>
            )} */}
            <PriceBucket>
              <div>
                <p style={{ color: "#b2b7c2", marginBottom: 0 }}>CURRENT BID</p>
                <PriceArea>
                  {auction?.highest_bid} (NEAR)
                  {/* <h6>{price.toFixed(2)}</h6>
                  <span>
                    ($
                    {getUsdValue(
                      props.state.singleNftProps.price *
                        PRICE_CONVERSION_VALUE || 0
                    )}
                    )
                  </span> */}
                </PriceArea>
              </div>
              <div>
                <PriceArea>
                  <form onSubmit={changeMessage}>
                    <label>Enter the amount you want to bid</label> (NEAR)
                    <input type="number" value={bid} onChange={handleChange} />
                    <button>Bid</button>
                  </form>

                  {/* <h6>{price.toFixed(2)}</h6>
                  <span>
                    ($
                    {getUsdValue(
                      props.state.singleNftProps.price *
                        PRICE_CONVERSION_VALUE || 0
                    )}
                    )
                  </span> */}
                </PriceArea>
              </div>
              {/* copy to test */}
              {/* <Popup>
                <div>
                  <PopupContent>
                    <div>
                      <Input
                        type="text"
                        // value={state.listingPrice}
                        // onChange={handleInputChange}
                        placeholder="Enter Listing Price"
                      />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          marginLeft: "40px",
                        }}
                      >
                        <Button
                        // onClick={handleSendClick}
                        >
                          List NFT
                        </Button>
                        <CloseButton
                        //   onClick={() => State.update({ isOpen: false })}
                        >
                          Close
                        </CloseButton>
                      </div>
                    </div>
                  </PopupContent>
                </div>
              </Popup> */}

              {/* original */}
              {/* {state.isOpen && (
                <Popup>
                  <div>
                    <PopupContent>
                      <div>
                        <Input
                          type="text"
                          value={state.listingPrice}
                          onChange={handleInputChange}
                          placeholder="Enter Listing Price"
                        />
                        <div
                          style={{
                            width: "100%",
                            display: flex,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            marginLeft: "40px",
                          }}
                        >
                          <Button onClick={handleSendClick}>List NFT</Button>
                          <CloseButton
                            onClick={() => State.update({ isOpen: false })}
                          >
                            Close
                          </CloseButton>
                        </div>
                      </div>
                    </PopupContent>
                  </div>
                </Popup> */}
              {/* )} */}
            </PriceBucket>
            <Description>
              <h6>Description</h6>
              <span>{auction?.item_metadata.description}</span>
            </Description>
            <Description>
              <h6>Attributes</h6>

              {/* test */}
              <AttributeContainer>
                <Attribute>
                  <div>
                    <span style={{ color: "#b2b7c2" }}>File Type</span>
                    <p style={{ marginTop: "10px" }}>image/png</p>
                  </div>
                  <div>
                    <span style={{ color: "#b2b7c2" }}>Rarity</span>
                    <p style={{ marginTop: "10px" }}>1%</p>
                  </div>
                </Attribute>
                <Attribute>
                  <div>
                    <span style={{ color: "#b2b7c2" }}>Category</span>
                    <p style={{ marginTop: "10px" }}>Digital Graphic</p>
                  </div>
                  <div>
                    <span style={{ color: "#b2b7c2" }}>Rarity</span>
                    <p style={{ marginTop: "10px" }}>1%</p>
                  </div>
                </Attribute>
              </AttributeContainer>

              {/* <AttributeContainer>
                {props.state.singleNftProps.attributes ? (
                  props.state.singleNftProps.attributes.map((data) => (
                    <Attribute>
                      <div>
                        <span style={{ color: "#b2b7c2" }}>File Type</span>
                         <p style={{ marginTop: "10px" }}>{data.trait_type}</p>
                      </div>
                      <div>
                        <span style={{ color: "#b2b7c2" }}>Rarity</span>
                        <p style={{ marginTop: "10px" }}>{data.value}</p>
                      </div>
                    </Attribute>
                  ))
                ) : (
                  <>
                    <Attribute>
                      <div>
                        <span style={{ color: "#b2b7c2" }}>File Type</span>
                        <p style={{ marginTop: "10px" }}>image/png</p>
                      </div>
                      <div>
                        <span style={{ color: "#b2b7c2" }}>Rarity</span>
                        <p style={{ marginTop: "10px" }}>1%</p>
                      </div>
                    </Attribute>
                    <Attribute>
                      <div>
                        <span style={{ color: "#b2b7c2" }}>Category</span>
                        <p style={{ marginTop: "10px" }}>Digital Graphic</p>
                      </div>
                      <div>
                        <span style={{ color: "#b2b7c2" }}>Rarity</span>
                        <p style={{ marginTop: "10px" }}>1%</p>
                      </div>
                    </Attribute>
                  </>
                )}
              </AttributeContainer> */}
            </Description>
            <Description>
              <h6>Details</h6>
              <MintDetails>
                <span>Created at</span>
                {new Date(auction?.created_at).toLocaleString()}
              </MintDetails>
              <MintDetails>
                <span>Updated at</span>
                {new Date(auction?.updated_at).toLocaleString()}
              </MintDetails>
            </Description>
          </RightSection>
        </TopSection>
      </MainContainer>
      <TransactionTable>
        <TableHeader>
          <h1>Auction History</h1>
        </TableHeader>
        {/* {props.state.singleNftProps.transactions ? (
        props.state.singleNftProps.transactions.map((data) => (
          <TableBody>
            <RowType>{data.type}</RowType>
            <a
              href={`${
                currentChain[props.state.singleNftProps.chain].explorer
              }/tx/${data.txId || ""}`}
              target="_blank"
            >
              <RowBody>
                <span>From</span>
                <p>
                  {`${data.owner ? data.owner.id.slice(0, 4) : ".."}...${
                    data.owner ? data.owner.id.slice(40) : "."
                  }`}
                </p>
                <span>To</span>
                <p>
                  {`${data.to ? data.to.id.slice(0, 4) : ".."}...${
                    data.to ? data.to.id.slice(40) : "."
                  }`}
                </p>
                <p>{getFormatedTxDate(data.txDate || "1662436482")}</p>
              </RowBody>
            </a>
          </TableBody>
        ))
      ) : (
        <TableBody>
          <RowType>Listing</RowType>
          <a
            href={`${currentChain[137].explorer}/tx/0x5edb90dfc01d8a50558fcbd55b33541204d8705f44dd19ce34752df4a53574d1`}
            target="_blank"
          >
            <RowBody>
              <span>From</span>
              <p>---</p>
              <span>To</span>
              <p>
                {defaultAddress.slice(0, 4)}
                {"..."}
                {defaultAddress.slice(38)}
              </p>
              <p>{getFormatedTxDate(data.txDate || "1662436482")}</p>
            </RowBody>
            </TableBody> */}
      </TransactionTable>
    </Root>
  );
}
