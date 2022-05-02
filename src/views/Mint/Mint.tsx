import React, { useCallback, useMemo, useState } from 'react';
import Page from '../../components/Page';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useModal from '../../hooks/useModal';
import useCatchError from '../../hooks/useCatchError';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import ExchangeModal from './components/ExchangeModal';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import { Alert } from '@material-ui/lab';


import { Box, Grid, Button, Card } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { BigNumber } from 'ethers';

const TITLE = 'bomb.money | Mint';


const Mint: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();

  const {Pool} = bombFinance.contracts;

  const catchError = useCatchError();

  const [_10SHAREInput, set10SHAREInput] = useState(BigNumber.from('0'))
  const [usdtInput, setUSDTInput] = useState(BigNumber.from('0'))
  const [_10MBInput, set10MBInput] = useState(BigNumber.from('0'))

  const handleMint10MB = useCallback(
    async () => {
      console.log("usdtInput ", usdtInput.toString())
      const tx = await Pool.mint(usdtInput, _10SHAREInput, '0');
      addTransaction(tx, { summary: `Mint 10MB` });
    },
    [bombFinance, addTransaction, usdtInput, _10SHAREInput],
  );
  const handleRedeem10MB = useCallback(
    async () => {
      const tx = await Pool.redeem(_10MBInput, '0', '0');
      addTransaction(tx, { summary: `Redeem 10MB` });
    },
    [bombFinance, addTransaction, _10MBInput],
  );

  const handleCollectRedeem10MB = useCallback(
    async () => {
      const tx = await Pool.collectRedemption();
      addTransaction(tx, { summary: `Redeem 10MB` });
    },
    [bombFinance, addTransaction, _10MBInput],
  );

  const isBondRedeemable = cashPrice.gt(BOND_REDEEM_PRICE_BN);

  console.log("bondStat ", bondStat)

  const bondScale = (Number(cashPrice) / 100000 ).toFixed(2);


  console.log("bondStat ", bondStat)
  console.log("isBondRedeemable ", isBondRedeemable)


  const [approveShareForMintStatus, approveShareForMint] = useApprove(bombFinance._10SHARE, Pool.address);
  const [approveUSDTForMintStatus, approveUSDTForMint] = useApprove(bombFinance.USDT, Pool.address);

  const [approve10MBForRedeemStatus, approve10MBForRedeem] = useApprove(bombFinance._10MB, Pool.address);


  const _10SHAREbalance = useTokenBalance(bombFinance._10SHARE);
  const [on10SHAREPresent, on10SHAREDismiss] = useModal(
    <ExchangeModal
      title={"Enter in 10SHARE amount"}
      description={"Enter in 10SHARE amount"}
      max={_10SHAREbalance}
      onConfirm={(value: string) => {
        try {
          set10SHAREInput(BigNumber.from(Math.floor(Number(value) * Math.pow(10, 9))).mul(Math.pow(10, 9)));
          on10SHAREDismiss();
        } catch (err) {
          console.log(err)
        }
      }}
      action={"Enter in 10SHARE amount"}
      tokenName={"10SHARE"}
    />,
  );

  const USDTbalance = useTokenBalance(bombFinance.USDT);
  const [onUSDTPresent, onUSDTDismiss] = useModal(
    <ExchangeModal
      title={"Enter in USDT amount"}
      description={"Enter in USDT amount"}
      max={USDTbalance}
      onConfirm={(value: string) => {
        try {
          setUSDTInput(BigNumber.from(Math.floor(Number(value) * Math.pow(10, 6))));
          onUSDTDismiss();
        } catch (err) {
          console.log(err)
        }
      }}
      action={"Enter in USDT amount"}
      tokenName={"USDT"}
      decimals={6}
    />,
  );

  const _10MBbalance = useTokenBalance(bombFinance._10MB);
  const [on10MBPresent, on10MBDismiss] = useModal(
    <ExchangeModal
      title={"Enter in 10MB amount"}
      description={"Enter in 10MB amount"}
      max={_10MBbalance}
      onConfirm={(value: string) => {
        try {
          set10MBInput(BigNumber.from(Math.floor(Number(value) * Math.pow(10, 9))).mul(Math.pow(10, 9)));
          on10MBDismiss();
        } catch (err) {
          console.log(err)
        }
      }}
      action={"Enter in 10MB amount"}
      tokenName={"10MB"}
    />,
  );

  return (
    <Switch>
      <Page>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        {!!account ? (
          <>
            <Route exact path={path}>
              <Grid container justifyContent="center">
                <Grid item lg={10}>
                  <PageHeader title="Mint &amp; Redeem 10MB" subtitle="Earn premiums upon redemption" />
                </Grid>
              </Grid>
            </Route>

            <StyledBond>
              <StyledCardWrapper>
                
              {approveUSDTForMintStatus !== ApprovalState.APPROVED ? (
              <Button
                fullWidth
                className="shinyButton"
                disabled={approveUSDTForMintStatus === ApprovalState.PENDING || approveUSDTForMintStatus === ApprovalState.UNKNOWN}
                onClick={() => catchError(approveUSDTForMint(), `Unable to approve USDT`)}
              >
                {`Approve USDT`}
              </Button>
            ) : (
              <>
              <Button
                fullWidth
                className="shinyButton"
                disabled={true}
                onClick={() => {}}
              >
              {(usdtInput.toNumber() / 1000000).toFixed(4)}
              </Button>
              <Button
                fullWidth
                className="shinyButton"
                disabled={false}
                onClick={onUSDTPresent}
              >
                {`Enter USDT amount`}
              </Button></>
            )}
              {approveShareForMintStatus !== ApprovalState.APPROVED ? (
              <Button
                fullWidth
                className="shinyButton"
                disabled={approveShareForMintStatus === ApprovalState.PENDING || approveShareForMintStatus === ApprovalState.UNKNOWN}
                onClick={() => catchError(approveShareForMint(), `Unable to approve 10SHARE`)}
              >
                {`Approve 10SHARE`}
              </Button>
            ) : (
              <>
              <Button
                fullWidth
                className="shinyButton"
                disabled={true}
                onClick={() => {}}
              >
              {(_10SHAREInput.div(BigNumber.from(10).pow(9)).toNumber() / 1000000000).toFixed(4)}
              </Button>
              <Button
                fullWidth
                className="shinyButton"
                disabled={false}
                onClick={on10SHAREPresent}
              >
                {`Enter 10SHARE amount`}
              </Button></>
            )}
              {approveUSDTForMintStatus === ApprovalState.APPROVED && approveShareForMintStatus === ApprovalState.APPROVED ? (
              <Button
                fullWidth
                className="shinyButton"
                disabled={false}
                onClick={() => catchError(handleMint10MB(), `Unable to mint 10MB`)}
              >
                {`Mint 10MB`}
              </Button>
            ) : (
              null
            )}
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="10 _10MB"
                  description="Last-Hour TWAP Price"
                  //price={Number(bombStat?.tokenInUSDT).toFixed(4) || '-'}
                  price={bondScale || '-'}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="10 _10BOND"
                  description="Current Price: (_10MB)^2"
                  price={(Number(bondStat?.tokenInUSDT) * 10).toFixed(2) || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
              {approve10MBForRedeemStatus !== ApprovalState.APPROVED ? (
              <Button
                fullWidth
                className="shinyButton"
                disabled={approve10MBForRedeemStatus === ApprovalState.PENDING || approve10MBForRedeemStatus === ApprovalState.UNKNOWN}
                onClick={() => catchError(approve10MBForRedeem(), `Unable to approve 10SHARE`)}
              >
                {`Approve 10MB`}
              </Button>
            ) : (


              <>
              <Button
                fullWidth
                className="shinyButton"
                disabled={true}
                onClick={() => {}}
              >
                {(_10MBInput.div(BigNumber.from(10).pow(9)).toNumber() / 1000000000).toFixed(4)}
              </Button>
              <Button
                fullWidth
                className="shinyButton"
                disabled={false}
                onClick={on10MBPresent}
              >
                {`Enter 10MB amount`}
              </Button></>
            )}

              {approve10MBForRedeemStatus === ApprovalState.APPROVED ? (
              <Button
                fullWidth
                className="shinyButton"
                disabled={false}
                onClick={() => catchError(handleRedeem10MB(), `Unable to redeem`)}
              >
                {`Redeem 10MB`}
              </Button>
            ) : (
              null
            )}
              {approve10MBForRedeemStatus === ApprovalState.APPROVED ? (
              <Button
                fullWidth
                className="shinyButton"
                disabled={false}
                onClick={() => catchError(handleCollectRedeem10MB(), `Unable to collect`)}
              >
                {`Collect Redeem Payout`}
              </Button>
            ) : (
              null
            )}
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Mint;
