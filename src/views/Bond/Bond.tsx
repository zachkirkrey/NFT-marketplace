import React, { useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
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

import { Box, Grid } from '@material-ui/core';
import { Helmet } from 'react-helmet';

const TITLE = '10mb.finance | Bonds';

const Bond: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();

  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance["10BOND"]);

  const isPreview = false

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      if (isPreview) {
        alert("Please wait for the site to be fully online!")
        return
      }
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} 10BOND with ${amount} 10MB`,
      });
    },
    [bombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      if (isPreview) {
        alert("Please wait for the site to be fully online!")
        return
      }
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} 10BOND` });
    },
    [bombFinance, addTransaction],
  );
  const isBondRedeemable = cashPrice.gt(BOND_REDEEM_PRICE_BN);

  console.log('bondStat ', bondStat);

  const isBondPurchasable = Number(bondStat?.tokenInUSDC) < 1.01;
  const isBondPayingPremium = Number(bondStat?.tokenInUSDC) >= 1.01;
  const bondScale = (Number(cashPrice) / 100000).toFixed(2);

  console.log('bondStat ', bondStat);
  console.log('isBondRedeemable ', isBondRedeemable);

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
                  <PageHeader title="Buy &amp; Redeem Bonds" subtitle="Earn premiums upon redemption" />
                </Grid>
              </Grid>
            </Route>
            {isBondPayingPremium === false ? (
              <Box>
                <Box justifyContent="center" style={{ margin: '18px', display: 'flex' }}>
                  <Alert variant="filled" severity="error">
                    <b>Claiming below 1.1 Peg receives a proportional redemption bonus. Claim wisely!</b>
                  </Alert>
                </Box>
              </Box>
            ) : null}

            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={bombFinance["10MB"]}
                  fromTokenName="10MB"
                  toToken={bombFinance["10BOND"]}
                  toTokenName="10BOND"
                  priceDesc={
                    !isBondPurchasable
                      ? '10MB is over peg'
                      : getDisplayBalance(bondsPurchasable, 18, 4) + ' 10BOND available for purchase'
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="10 10MB"
                  description="TWAP Price"
                  //price={Number(bombStat?.tokenInUSDC).toFixed(4) || '-'}
                  price={isPreview ? '1.00' : bondScale || '-'}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="10 10BOND"
                  description="Current Price: (10MB)^2"
                  price={(Number(bondStat?.tokenInUSDC) * 10).toFixed(2) || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={bombFinance["10BOND"]}
                  fromTokenName="10BOND"
                  toToken={bombFinance["10MB"]}
                  toTokenName="10MB"
                  priceDesc={`${getDisplayBalance(bondBalance)} 10BOND Available in wallet`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when 10 10MB > ${BOND_REDEEM_PRICE}USDC` : null}
                />
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

export default Bond;
