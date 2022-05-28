import React, { useCallback, useMemo, useState } from 'react';
import { Wrapper, PriceWrapper, InputWrapper } from './MintRedeem.styles';
import triangle from '../../../assets/img/triangle.svg';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useCatchError from '../../../hooks/useCatchError';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../../components/UnlockWallet';
import ExchangeModal from './ExchangeModal';
import PageHeader from '../../../components/PageHeader';
import ExchangeCard from './ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../../components/Spacer';
import useBondStats from '../../../hooks/useBondStats';
import useBombFinance from '../../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import ExchangeStat from './ExchangeStat';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useBondsPurchasable from '../../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../../bomb-finance/constants';
import { Alert } from '@material-ui/lab';

import { Box, Grid, Button, Card } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { BigNumber } from 'ethers';

type MorR = 'mint' | 'redeem';

export default function MintRedeem() {
  const [mintOrRedeem, setMintOrRedeem] = useState<MorR>('mint');
  const [redeem, setRedeem] = useState('');
  const [mintUsdt, setMintUsdt] = useState('');
  const [mintShare, setMintShare] = useState('');

    const { account } = useWallet();
    const { path } = useRouteMatch();
    const bombFinance = useBombFinance();
    const addTransaction = useTransactionAdder();
    const bondStat = useBondStats();
    const cashPrice = useCashPriceInLastTWAP();
  
    const { Pool } = bombFinance.contracts;
  
    const catchError = useCatchError();
  
  
    const handleMint10MB = useCallback(async () => {
      const usdtString = BigNumber.from(Math.floor(Number(mintUsdt) * Math.pow(10, 6))).toString()
      const _10SHAREString = BigNumber.from(Math.floor(Number(mintShare) * Math.pow(10, 9))).mul(Math.pow(10, 9)).toString()

      console.log("usdtString ", usdtString)
      console.log("_10SHAREString ", _10SHAREString)

      const tx = await Pool.mint(usdtString, _10SHAREString, '0');
      addTransaction(tx, { summary: `Mint 10MB` });
    }, [mintUsdt, Pool, mintShare, addTransaction]);
    const handleRedeem10MB = useCallback(async () => {
      const _10MBString = BigNumber.from(Math.floor(Number(redeem) * Math.pow(10, 9))).mul(Math.pow(10, 9)).toString()

      const tx = await Pool.redeem(_10MBString, '0', '0');
      addTransaction(tx, { summary: `Redeem 10MB` });
    }, [Pool, redeem, addTransaction]);
  
    const handleCollectRedeem10MB = useCallback(async () => {
      const tx = await Pool.collectRedemption();
      addTransaction(tx, { summary: `Redeem 10MB` });
    }, [Pool, addTransaction]);
  
    const isBondRedeemable = cashPrice.gt(BOND_REDEEM_PRICE_BN);
  
    console.log('bondStat ', bondStat);
  
    const bondScale = (Number(cashPrice) / 100000).toFixed(2);
  
    console.log('bondStat ', bondStat);
    console.log('isBondRedeemable ', isBondRedeemable);
  
    const [approveShareForMintStatus, approveShareForMint] = useApprove(bombFinance["10SHARE"], Pool.address);
    const [approveUSDTForMintStatus, approveUSDTForMint] = useApprove(bombFinance.USDT, Pool.address);
  
    const [approve10MBForRedeemStatus, approve10MBForRedeem] = useApprove(bombFinance["10MB"], Pool.address);
  
    const _10SHAREbalance = useTokenBalance(bombFinance["10SHARE"]);

  return (
    <Wrapper>
      <div className="stateButtons">
        <button onClick={() => setMintOrRedeem('mint')} className={mintOrRedeem === 'mint' ? 'select' : null}>
          MINT
        </button>
        <button onClick={() => setMintOrRedeem('redeem')} className={mintOrRedeem === 'redeem' ? 'select' : null}>
          REDEEM
        </button>
      </div>
      <div className="content">
        {mintOrRedeem === 'mint' ? (
          <>
            <div className="prices">
              <Input type="USDT" inputState={mintUsdt} setInputState={setMintUsdt} />
              <span>+</span>
              <Input type="10SHARE" inputState={mintShare} setInputState={setMintShare} />
            </div>
            <div className="triangleContainer">
              <img src={triangle} alt="triangle icon" />
              <img src={triangle} alt="triangle icon" />
            </div>
            <div className="mintTo">
              <PriceContent
                value={0}
                type="10MB"
                border="divBgDark"
                color="blue"
              />
            </div>
          </>
        ) : (
          <>
            <Input type="10MB" inputState={redeem} setInputState={setRedeem} />
            <div className="triangleContainer">
              <img src={triangle} alt="triangle icon" />
              <img src={triangle} alt="triangle icon" />
            </div>
            <div className="redeemTo">
              <PriceContent value={+(Number(0)).toFixed(2)} type="USDT" border="divBgDark" color="blue" />
              <span>+</span>
              <PriceContent
                value={+(Number(0)).toFixed(2)}
                type="10SHARE"
                border="divBgDark"
                color="blue"
              />
            </div>
            <div className="amountCollect">
              <p>Amount to collect</p>
              <div>
                <PriceContent value={+(Number(0)).toFixed(2)} type="USDT" border="yellow" color="white" />
                <span>+</span>
                <PriceContent
                  value={+(Number(0)).toFixed(2)}
                  type="10SHARE"
                  border="yellow"
                  color="white"
                />
              </div>
            </div>
          </>
        )}
        <div className="info">
          <div>
            <p>10 10MB = 0.77 USDT</p>
            <p>Last-Hour TWAP Price</p>
          </div>
          <div>
            <p>10 10BOND = 0.77 USDT</p>
            <p>Current Price: (10MB)*2</p>
          </div>
        </div>
      </div>

      {mintOrRedeem === 'mint' ? (
         approveUSDTForMintStatus === ApprovalState.APPROVED && approveShareForMintStatus === ApprovalState.APPROVED ? (
        <div className="mintButton">
          <Button 
          onClick={() => catchError(handleMint10MB(), `Unable to mint 10MB`)}
          disabled={mintUsdt === '' && mintShare === '' } className={mintUsdt || mintShare ? null : 'loadingBg'}>MINT</Button>
        </div>
      ) : (
        <div className="mintButton">
        <Button 
        onClick={() => catchError(approveUSDTForMint() && approveShareForMint(), `Unable to approve 10MB + USDT`)}
        >{`APPROVE ${approveUSDTForMintStatus !== ApprovalState.APPROVED ? 'USDT' : ''}${approveUSDTForMintStatus !== ApprovalState.APPROVED  && approveShareForMintStatus !== ApprovalState.APPROVED ? ' + ' : ''}${approveShareForMintStatus !== ApprovalState.APPROVED ? '10SHARE' : ''}`}</Button>
      </div>
       )
      ) : approve10MBForRedeemStatus === ApprovalState.APPROVED ? (
        <div className="redeemButtons">
          <Button 
          onClick={() => catchError(handleRedeem10MB(), `Unable to redeem`)}
          disabled={redeem === ''} className={redeem ? null : 'loadingBg'}>
            REDEEM
          </Button>
          <Button 
          onClick={() => catchError(handleCollectRedeem10MB(), `Unable to collect`)}
          disabled={redeem === ''} className={redeem ? null : 'loadingBg'}>COLLECT</Button>
        </div>
      ) : (
        <div className="redeemButtons">
        <Button 
        onClick={() => catchError(approve10MBForRedeem(), `Unable to approve 10MB`)}
        >
          APPROVE 10MB
        </Button>
      </div>
      )}
    </Wrapper>
  );
}

interface InputProps {
  type: string;
  inputState: string;
  setInputState: React.Dispatch<React.SetStateAction<string>>;
}

function Input({ inputState, setInputState, type }: InputProps) {
  return (
    <InputWrapper>
      <p>{type}</p>
      <input
        type="text"
        onChange={(e) => setInputState(e.target.value)}
        className={inputState ? null : 'loadingColor'}
        placeholder="0.0"
        onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
        value={inputState}
      />
    </InputWrapper>
  );
}

interface PriceProps {
  border: string;
  color: string;
  type: string;
  value: number;
}

function PriceContent({ border, color, value, type }: PriceProps) {
  return (
    <PriceWrapper border={border} color={color}>
      <p>{type}</p>
      <p className={value > 0 ? null : 'loadingColor'}>{value > 0 ? value : '0.0'}</p>
    </PriceWrapper>
  );
}
