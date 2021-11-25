import React, { useMemo } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import CashImage from '../../assets/img/crypto_tomb_cash.svg';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { Bomb as bombTesting, BShare as tShareTesting } from '../../bomb-finance/deployments/deployments.testing.json';
import { Bomb as bombProd, BShare as tShareProd } from '../../bomb-finance/deployments/deployments.mainnet.json';

import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background: url(${HomeImage}) no-repeat !important;
//     background-size: cover !important;
//   }
// `;

const BackgroundImage = createGlobalStyle`
  body {
    background-color: grey;
    background-size: cover !important;
  }
`;


const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-APELP');
  const tShareFtmLpStats = useLpStats('BSHARE-BNB-APELP');
  const bombStats = useBombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();

  let bomb;
  let tShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    bomb = bombTesting;
    tShare = tShareTesting;
  } else {
    bomb = bombProd;
    tShare = tShareProd;
  }

  const buyBombAddress =
    'https://app.apeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    bomb.address;
  const buyBShareAddress = 'https://app.apeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';

  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInBNB = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  // const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  // const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  // const StyledLink = styled.a`
  //   font-weight: 700;
  //   text-decoration: none;
  // `;

  // const [onPresentBombZap, onDissmissBombZap] = useModal(
  //   <ZapModal
  //     decimals={18}
  //     onConfirm={(zappingToken, tokenName, amount) => {
  //       if (Number(amount) <= 0 || isNaN(Number(amount))) return;
  //       bombLpZap.onZap(zappingToken, tokenName, amount);
  //       onDissmissBombZap();
  //     }}
  //     tokenName={'BOMB-BTCB-LP'}
  //   />,
  // );

  // const [onPresentBshareZap, onDissmissBshareZap] = useModal(
  //   <ZapModal
  //     decimals={18}
  //     onConfirm={(zappingToken, tokenName, amount) => {
  //       if (Number(amount) <= 0 || isNaN(Number(amount))) return;
  //       bshareLpZap.onZap(zappingToken, tokenName, amount);
  //       onDissmissBshareZap();
  //     }}
  //     tokenName={'BSHARE-BNB-LP'}
  //   />,
  // );

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid item xs={12} sm={4}>
          <Paper>
            <Box p={4}>
              <h2>Schedule</h2>
              <ul>
                <li>
                  <strong>Genesis Farm:</strong> Nov 20 23:00 - FINISHED
                </li>
                <li>
                  <strong>Bomb Farm:</strong> Nov 21 23:00 - 9 days
                </li>
                <li>
                  <strong>BSHARE Farm:</strong> Nov 25 23:00 - 365 days
                </li>

              </ul>
            </Box>
          </Paper>
          {/* <Paper>xs=6 sm=3</Paper> */}
          {/* <Image color="none" style={{ width: '300px', paddingTop: '0px' }} src={CashImage} /> */}
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4}>
              <h2>Welcome to Bomb Money</h2>
              <p>
                We are a tomb.finance clone on BSC, but with a price that follows BTC.  Get amazing rewards and exposure to BTC!
              </p>
              <p><strong>BOMB is pegged via algorithm to a 10,000:1 ratio to BTC.  $100k BTC = $10 BOMB PEG</strong>
                {/* Stake your BOMB-BTC LP in the Farm to earn BSHARE rewards. Then stake your earned BSHARE in the
                Boardroom to earn more BOMB! */}
              </p>
            </Box>
          </Paper>
        </Grid>

        {/* <Grid container spacing={3}>
          <Grid item xs={12} sm={12} justify="center" style={{ margin: '12px', display: 'flex' }}>
            <Alert variant="filled" severity="error">
              <b>
                We are in the process of upgrading our boardroom smart contract. If you have staked BSHARE in the boardroom, kindly remove at your earliest convenience.
              </b>
            </Alert>
          </Grid>
        </Grid> */}

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button color="primary" href="/boardroom" variant="contained" style={{ marginRight: '10px' }}>
                Stake Now
              </Button>
              <Button href="/farm" variant="contained" style={{ marginRight: '10px' }}>
                Farm Now
              </Button>
              <Button
                color="primary"
                target="_blank"
                href={buyBombAddress}
                variant="contained"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                Buy BOMB
              </Button>
              <Button variant="contained" target="_blank" href={buyBShareAddress} className={classes.button}>
                Buy BSHARE
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* BOMB */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>BOMB</h2>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BOMB');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BOMB" />
                </CardIcon>
              </Box>
              10,000 BOMB (1.0 Peg) =
              <Box>
                <span style={{ fontSize: '30px' }}>{bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${bombPriceInDollars ? bombPriceInDollars : '-.--'} / BOMB
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(bombCirculatingSupply * bombPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {bombCirculatingSupply} <br />
                Total Supply: {bombTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* BSHARE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>BSHARE</h2>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BSHARE');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tSharePriceInBNB ? tSharePriceInBNB : '-.----'} BNB</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tShareCirculatingSupply} <br />
                Total Supply: {tShareTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* BBOND */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>BBOND</h2>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BBOND');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BBOND" />
                </CardIcon>
              </Box>
              Price per unit
              <Box>
                <span style={{ fontSize: '30px' }}>{tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / BOMB</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tBondCirculatingSupply} <br />
                Total Supply: {tBondTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>BOMB-BTCB PancakeSwap LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BOMB-BTCB-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                {/* <Button color="primary" disabled={true} onClick={onPresentBombZap} variant="contained">
                  Zap In
                </Button> */}
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {bombLPStats?.tokenAmount ? bombLPStats?.tokenAmount : '-.--'} BOMB /{' '}
                  {bombLPStats?.ftmAmount ? bombLPStats?.ftmAmount : '-.--'} BTCB
                </span>
              </Box>
              <Box>${bombLPStats?.priceOfOne ? bombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${bombLPStats?.totalLiquidity ? bombLPStats.totalLiquidity : '-.--'} <br />
                Total supply: {bombLPStats?.totalSupply ? bombLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>BSHARE-BNB PancakeSwap LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE-BNB-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                {/* <Button color="primary" onClick={onPresentBshareZap} variant="contained">
                  Zap In
                </Button> */}
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} BSHARE /{' '}
                  {bshareLPStats?.ftmAmount ? bshareLPStats?.ftmAmount : '-.--'} BNB
                </span>
              </Box>
              <Box>${bshareLPStats?.priceOfOne ? bshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${bshareLPStats?.totalLiquidity ? bshareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply: {bshareLPStats?.totalSupply ? bshareLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
