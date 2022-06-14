import React, { useEffect, useMemo, useContext, useState } from 'react';
import styled from 'styled-components';

// import Button from '../../../components/Button';
import { Box, Button, Card, CardContent, Paper, Typography } from '@material-ui/core';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import IconButton from '../../../components/IconButton';
//import Label from '../../../components/Label';
import Value from '../../../components/Value';
import { ThemeContext } from 'styled-components';

import useNFTApprove, { ApprovalState } from '../../../hooks/useNFTApprove';
import useModal from '../../../hooks/useModal';
import useNFTStake from '../../../hooks/useNFTStake';
import useZap from '../../../hooks/useZap';
import useStakedNFTs from '../../../hooks/useStakedNFTs';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useNFTWithdraw from '../../../hooks/useNFTWithdraw';

import { getDefaultProvider } from '../../../utils/provider';
import ERC20 from '../../../bomb-finance/ERC20';

import { getDisplayBalance } from '../../../utils/formatBalance';

import useBombFinance from '../../../hooks/useBombFinance';

import NFTDepositModal from './NFTDepositModal';
import WithdrawModal from './WithdrawModal';
import ZapModal from './ZapModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../bomb-finance';
import { BigNumber } from 'ethers';

import axios from "axios";

interface StakeProps {
  bank: Bank;
  slotId: number
}

export async function getMetaData(metaUrl: string, nftId: string) {
  const json = await axios.get(metaUrl + nftId);
  return json["data"];
}


const NFTStake: React.FC<StakeProps> = ({ bank, slotId }) => {
  const baseURLs = ['https://api.madmeerkat.io/api/tokens/tree/', 'https://api.madmeerkat.io/api/tokens/cro/1', 'https://majestic-minotaurs.s3.us-east-2.amazonaws.com/infos/']
  const nftAddressesArray = ['0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56', '0xDC5bBDb4A4b051BDB85B959eB3cBD1c8C0d0c105', '0xfE52ebb3aDb92CBA733B8DD3342DaAbf67A250a3']
  const nftNamesArray = ['MM Burrow', 'MM Treehouse', 'Minotaurs']
  const [selectedNFT, setSelectedNFT] = useState(nftNamesArray[0]);
  const [nftTypeImageAddress, setNftTypeImageAddress] = useState('');
  const [stakedNftTypeImageAddress, setStakedNftTypeImageAddress] = useState('');
  const [walletContents, setWalletContents] = useState([]);
  const [walletURLContents, setWalletURLContents] = useState([]);

  const bombFinance = useBombFinance();
  const signer = bombFinance['signer']

  const [mmBurrowApproveStatus, mmBurrowApprove] = useNFTApprove(new ERC20(nftAddressesArray[0], signer, nftNamesArray[0], 18), bank.address);
  const [mmTreehouseApproveStatus, mmTreehouseApprove] = useNFTApprove(new ERC20(nftAddressesArray[1], signer, nftNamesArray[1], 18), bank.address);
  const [minotaurApproveStatus, minotaurApprove] = useNFTApprove(new ERC20(nftAddressesArray[2], signer, nftNamesArray[2], 18), bank.address);

  const approvedStatusesArray = [mmBurrowApproveStatus, mmTreehouseApproveStatus, minotaurApproveStatus]
  const approvesArray = [mmBurrowApprove, mmTreehouseApprove, minotaurApprove]

  const stakedBalance = useStakedNFTs(bank.contract, bank.poolId);

  const { onNFTStake } = useNFTStake(bank);
  const { onNFTWithdraw } = useNFTWithdraw(bank);

  const isPreview = false

  const zeroAddress = '0x0000000000000000000000000000000000000000'

  let isSlotTaken = false
  let slotAddress = zeroAddress
  let slotNftId = 0

  if (stakedBalance.length > 0) {
    if (stakedBalance[0].length > 0) {
      if (stakedBalance[0][slotId - 1] != zeroAddress) {
        isSlotTaken = true
        slotAddress = stakedBalance[0][slotId - 1]
        slotNftId = stakedBalance[1][slotId - 1]
      }
    }
  }

  const filledNftTypeIndex: number = nftAddressesArray.lastIndexOf(slotAddress)

  const nftTypeIndex =  nftNamesArray.lastIndexOf(selectedNFT)

  const approveStatus = approvedStatusesArray[nftTypeIndex]
  const approve = approvesArray[nftTypeIndex]

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <NFTDepositModal
      max={BigNumber.from(100000000)}
      decimals={bank.depositToken.decimal}
      onConfirm={(nftId) => {
        if (isPreview) {
          alert("Please wait for the site to be fully online!")
          return
        }
        if (Number(nftId) <= 0 || isNaN(Number(nftId))) return;
        if (filledNftTypeIndex != -1) {
          alert(`Please first unstake your ${nftNamesArray[filledNftTypeIndex]} NFT with TokenID ${slotNftId} from slot ${slotId}!`)
          return
        }
        onNFTStake(nftAddressesArray[nftTypeIndex], Number(nftId), slotId);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );


  useEffect(() => {
    const fetchData = async () => {
      const metaJson = await getMetaData(baseURLs[nftTypeIndex], '0');
      setNftTypeImageAddress(metaJson['image']);
      console.log("metaJson ", metaJson);
    };
    fetchData();
  }, [nftTypeIndex]);

  useEffect(() => {
  const fetchData = async () => {
    if (filledNftTypeIndex == -1) return
    const metaJson = await getMetaData(baseURLs[filledNftTypeIndex], slotNftId+'');
    setStakedNftTypeImageAddress(metaJson['image']);
    console.log("metaJson ", metaJson);
  };
  fetchData();
}, [filledNftTypeIndex]);

const account = bombFinance['myAccount']

useEffect(() => {
  const fetchData = async () => {
    const erc721 = new ERC20(nftAddressesArray[nftTypeIndex], signer, nftNamesArray[nftTypeIndex], 18)

    console.log("account 1 ", account)
    if (!account) return
    console.log("account 2 ", account)
    let ans: React.SetStateAction<any[]> = []
    try {
      ans = await erc721.walletOfOwner(account)
    } catch (err) {
      console.log(err)
    } 
    console.log("await erc721.walletOfOwner(account) ", ans)
    setWalletContents(ans)
  };
  fetchData();
}, [account, filledNftTypeIndex, nftTypeIndex]);

useEffect(() => {
  const fetchData = async () => {
    const walletURLs = []
    for (const id of walletContents) {
      const metaJson = await getMetaData(baseURLs[nftTypeIndex], id.toString());
      walletURLs.push(metaJson['image'])
    }
    setWalletURLContents(walletURLs)
  };
  fetchData();
}, [walletContents]);

console.log("walletContents ", walletContents)
console.log("walletURLContents ", walletURLContents)


  return (
    <Paper>
      <Box display="flex" flexDirection="column" alignItems="center" px={3} py={6}>
      {`Selected NFT Type ${selectedNFT}`}
<br/>
      <img
            src={nftTypeImageAddress}
            alt="NFT"
            style={{ marginLeft: "auto" }}
            className="z-10 rounded ml-auto"
            width={300}
            height={300}
          />
        slotId {slotId}
        <br/>

{
  nftNamesArray.map((name) =>
        <>
            <IconButton key={name} onClick={() => {
              if (isPreview) {
                alert("Please wait for the site to be fully online!")
                return
              }
              
              setSelectedNFT(name)
            }}>
              {name}
            </IconButton>
            <StyledActionSpacer />
          </>
  )
}
        {/* <Label text={`${bank.depositTokenName} Staked`} /> */}
        {approveStatus !== ApprovalState.APPROVED ? (
          <Button
            disabled={
              approveStatus === ApprovalState.PENDING ||
              approveStatus === ApprovalState.UNKNOWN
            }
            onClick={() => {
              if (isPreview) {
                alert("Please wait for the site to be fully online!")
                return
              }
              console.log("approve ", approve)
              approve()
            }}
            className={
              approveStatus === ApprovalState.PENDING ||
              approveStatus === ApprovalState.UNKNOWN
                ? 'shinyButtonDisabled'
                : 'shinyButton'
            }
          >
            {`Approve ${selectedNFT}`}
          </Button>
        ) : (
          <>
          {isSlotTaken && filledNftTypeIndex == nftTypeIndex ? <>
            <IconButton onClick={() => {
              if (isPreview) {
                alert("Please wait for the site to be fully online!")
                return
              }
              onNFTWithdraw(slotId);
            }}>
              <RemoveIcon />
            </IconButton> 
            <StyledActionSpacer /> </> : null }
            <IconButton
              disabled={bank.closedForStaking}
              onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
            >
              <AddIcon />
            </IconButton>
          </>
        )}
        Total NFT Boost: {isSlotTaken ? 3 : 0}%
        <br/>
        Staked:
        <br/>
        {!isSlotTaken ? `${nftNamesArray[nftTypeIndex]} not staked` : <>
        {isSlotTaken ? `${nftNamesArray[filledNftTypeIndex]} is staked` : "Empty slot"}</>}
        <br/>
      {isSlotTaken ?
        <img
            src={stakedNftTypeImageAddress}
            alt="NFT"
            style={{ marginLeft: "auto" }}
            className="z-10 rounded ml-auto"
            width={300}
            height={300}
          /> : null
      }
        Wallet:
        <br/>
        {walletURLContents.length == 0 ? "Wallet is empty!" : walletURLContents.map(url => {
          return <>
          NFTId: {walletContents[walletURLContents.lastIndexOf(url)] ? walletContents[walletURLContents.lastIndexOf(url)].toString() : '..'}
          <img
          src={url}
          alt="NFT"
          style={{ marginLeft: "auto" }}
          className="z-10 rounded ml-auto"
          width={300}
          height={300}
        /></>
        })}
      </Box>
    </Paper>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

export default NFTStake;
