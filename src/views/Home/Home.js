import React, { useMemo } from 'react';
import Page from '../../components/Page';
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
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { Alert } from '@material-ui/lab';
import tenWhiteImg from '../../assets/img/10-white.svg';

import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import BombImage from '../../assets/img/bomb.png';

import { withStyles } from '@material-ui/styles';
import { bgGradient, bgGradientHighlighted } from '../../theme/colors';
import { TokenCard } from './TokenCard';
import { TokenSwapCard } from './TokenSwapCard';
import { PromotedTokenCard } from './PromotedTokenCard';

const TITLE = 'bomb.money | BTC pegged algocoin';

const useStyles = makeStyles((theme) => ({
  jumbotronImage: {
    display: 'block',
    position: 'relative',
    top: -40,
    marginBottom: -40,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 200,

    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: -32,
      left: 0,
      width: 320,
      marginBottom: 0,
    },
  },
  jumbotronText: {
    [theme.breakpoints.up('md')]: {
      paddingLeft: 352,
    },
  },
  tvlBgAdornment: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 80,
    height: 80,
    backgroundImage: `url(${tenWhiteImg})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    opacity: 0.15,
  },
  tvlBgAdornment2: {
    position: 'absolute',
    top: 6,
    right: 10,
    width: 32,
    height: 32,
    backgroundImage: `url(${tenWhiteImg})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    opacity: 0.15,
  },
  tombforkTokenPrice: {
    color: theme.palette.text.yellow,
  },
  governanceTokenPrice: {
    color: '#119aff',
  },
  '10bondTokenPrice': {
    color: '#fa8f18',
  },
}));

const HighlightedPaper = withStyles({
  root: {
    background: '#043378',
  },
})(Paper);

const JumbotronPaper = withStyles({
  root: {
    background: bgGradient,
    position: 'relative',
    marginTop: 82,
    boxShadow: 'rgb(72 108 182 / 20%) 0px -10px 0px inset',
  },
})(HighlightedPaper);

const TotalValueLockedPaper = withStyles((theme) => ({
  root: {
    position: 'relative',
    background: bgGradientHighlighted,

    [theme.breakpoints.up('md')]: {
      marginTop: -48,
    },
  },
}))(Paper);

const PromotedTokensGridItem = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      '&:not(:last-child)': {
        borderRight: `1px solid rgba(255, 255, 255, 0.1)`,
      },
    },
  },
}))(Grid);

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();

  let bomb;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    bomb = bombTesting;
  } else {
    bomb = bombProd;
  }

  const buyBombAddress =
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=' + bomb.address;
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

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

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      {/* <BackgroundImage /> */}
      <Alert variant="filled" severity="info" action={<Button href="https://bombbtc.com">BOMBBTC.COM</Button>}>
        BOMB BTC MAINNET STAKING!{' '}
        <a href="https://bombbtc.com" style={{ color: 'inherit' }}>
          Stake Bitcoin from BTC Mainnet!
        </a>
      </Alert>

      <Grid container spacing={3}>
        {/* <Grid container spacing={3}>
          <Grid item xs={12} sm={12} justify="center" style={{ margin: '12px', display: 'flex' }}>
            <Alert variant="filled" severity="info" action={<Button href="https://bombbtc.com">BOMBBTC.COM</Button>}>
              BOMB BTC MAINNET STAKING! Stake Bitcoin from BTC Mainnet!
            </Alert>
          </Grid>
        </Grid> */}

        {/* TVL */}
        <Grid item>
          <JumbotronPaper>
            <img src={BombImage} alt="Bomb.money" className={classes.jumbotronImage} />
            <Box p={[2, 2, 4]} className={classes.jumbotronText}>
              <Box display={['block', 'block', 'flex']} alignItems="start">
                <Box flex={1} mr={3}>
                  <h2>Welcome to Bomb</h2>
                  <p>
                    BOMB is an algocoin which is designed to follow the price of BTC. Enjoy high yields normally only
                    found on high risk assets, but with exposure to BTC instead!
                  </p>
                  <p>
                    <strong>BOMB is pegged via algorithm to a 10,000:1 ratio to BTC. $100k BTC = $10 BOMB PEG</strong>
                    {/* Stake your BOMB-BTC LP in the Farm to earn BSHARE rewards. Then stake your earned BSHARE in the
                Boardroom to earn more BOMB! */}
                  </p>
                  <p>
                    <IconTelegram alt="telegram" style={{ fill: '#dddfee', height: '15px' }} /> Join our{' '}
                    <a
                      href="https://t.me/bombmoneybsc"
                      rel="noopener noreferrer"
                      target="_blank"
                      style={{ color: '#dddfee' }}
                    >
                      Telegram
                    </a>{' '}
                    to find out more!
                  </p>
                </Box>
                <TotalValueLockedPaper>
                  <div className={classes.tvlBgAdornment} />
                  <div className={classes.tvlBgAdornment2} />
                  <Box p={3} textAlign="center">
                    <h2>Total Value Locked</h2>
                    <CountUp style={{ fontSize: '36px' }} end={TVL} separator="," prefix="$" />
                  </Box>
                </TotalValueLockedPaper>
              </Box>
            </Box>
          </JumbotronPaper>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button href="https://bomb.farm/" className="shinyButtonGreen" style={{ margin: '5px' }}>
                Autovaults
              </Button>
              <Button href={buyBombAddress} style={{ margin: '5px' }} className={'shinyButton ' + classes.button}>
                Buy BOMB
              </Button>
              <Button href={buyBShareAddress} className={'shinyButton ' + classes.button} style={{ margin: '5px' }}>
                Buy BSHARE
              </Button>
              <Button
                target="_blank"
                href="https://dexscreener.com/bsc/0x84392649eb0bc1c1532f2180e58bae4e1dabd8d6"
                className="shinyButton"
                style={{ margin: '5px' }}
              >
                BOMB Chart
              </Button>
              <Button
                target="_blank"
                href="https://dexscreener.com/bsc/0x1303246855b5b5ebc71f049fdb607494e97218f8"
                className="shinyButton"
                style={{ margin: '5px' }}
              >
                BSHARE Chart
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <HighlightedPaper style={{ overflow: 'hidden' }}>
            <Grid container>
              <PromotedTokensGridItem item xs={12} md={6}>
                <PromotedTokenCard type="treasure" />
              </PromotedTokensGridItem>
              <PromotedTokensGridItem item xs={12} md={6}>
                <PromotedTokenCard type="invested" />
              </PromotedTokensGridItem>
            </Grid>
          </HighlightedPaper>
        </Grid>

        {/* BOMB */}
        <Grid item xs={12} md={4}>
          <TokenCard
            onMetamaskFoxIconClick={() => bombFinance.watchAssetInMetamask('BOMB')}
            tokenSymbol="BOMB"
            tokenName="BOMB"
            topSubtext="10,000 BOMB (1.0 Peg) ="
            mainText={`${bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC`}
            bottomSubtext={`$${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'} / BOMB`}
            marketCap={`$${roundAndFormatNumber(bombCirculatingSupply * bombPriceInDollars, 2)}$`}
            circulatingSupply={roundAndFormatNumber(bombCirculatingSupply, 2)}
            totalSupply={roundAndFormatNumber(bombTotalSupply, 2)}
            price={<span className={classes.tombforkTokenPrice}>0.1 USDT</span>}
          />
        </Grid>

        {/* BSHARE */}
        <Grid item xs={12} md={4}>
          <TokenCard
            onMetamaskFoxIconClick={() => bombFinance.watchAssetInMetamask('BSHARE')}
            tokenSymbol="BSHARE"
            tokenName="BSHARE"
            topSubtext="Current Price"
            mainText={`${bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB`}
            bottomSubtext={`$${bSharePriceInDollars ? bSharePriceInDollars : '-.--'} / BSHARE`}
            marketCap={`$${roundAndFormatNumber((bShareCirculatingSupply * bSharePriceInDollars).toFixed(2), 2)}`}
            circulatingSupply={roundAndFormatNumber(bShareCirculatingSupply, 2)}
            totalSupply={roundAndFormatNumber(bShareTotalSupply, 2)}
            price={<span className={classes.governanceTokenPrice}>10000 USDT</span>}
          />
        </Grid>

        {/* BBOND */}
        <Grid item xs={12} md={4}>
          <TokenCard
            onMetamaskFoxIconClick={() => bombFinance.watchAssetInMetamask('BBOND')}
            tokenSymbol="BBOND"
            tokenName="BBOND"
            topSubtext="10,000 BBOND"
            mainText={tBondPriceInBNB ? tBondPriceInBNB : '-.----'}
            BTC
            bottomSubtext={`$${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / BBOND`}
            marketCap={`$${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)}`}
            circulatingSupply={roundAndFormatNumber(tBondCirculatingSupply, 2)}
            totalSupply={roundAndFormatNumber(tBondTotalSupply, 2)}
            price={<span className={classes['10bondTokenPrice']}>-- USDT</span>}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TokenSwapCard
            title="BOMB-BTCB LP"
            // title="BOMB-BTCB PancakeSwap LP"
            tokenSymbol="BOMB-BTCB-LP"
            onZapInClick={onPresentBombZap}
            zapInDisabled
            swapPrice={`${bombLPStats?.tokenAmount ? bombLPStats?.tokenAmount : '-.--'} BOMB / 
            ${bombLPStats?.ftmAmount ? bombLPStats?.ftmAmount : '-.--'} BTCB`}
            price={`$${bombLPStats?.priceOfOne ? bombLPStats.priceOfOne : '-.--'}`}
            liquidity={`$${bombLPStats?.totalLiquidity ? roundAndFormatNumber(bombLPStats.totalLiquidity, 2) : '-.--'}`}
            totalSupply={`${bombLPStats?.totalSupply ? roundAndFormatNumber(bombLPStats.totalSupply, 2) : '-.--'}`}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TokenSwapCard
            title="BSHARE-BNB LP"
            // title="BSHARE-BNB PancakeSwap LP"
            tokenSymbol="BSHARE-BNB-LP"
            onZapInClick={onPresentBombZap}
            swapPrice={`${bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} BSHARE /
            ${bshareLPStats?.ftmAmount ? bshareLPStats?.ftmAmount : '-.--'} BNB`}
            price={`$${bshareLPStats?.priceOfOne ? bshareLPStats.priceOfOne : '-.--'}`}
            liquidity={`$${
              bshareLPStats?.totalLiquidity ? roundAndFormatNumber(bshareLPStats.totalLiquidity, 2) : '-.--'
            }`}
            totalSupply={bshareLPStats?.totalSupply ? roundAndFormatNumber(bshareLPStats.totalSupply, 2) : '-.--'}
          />
          {/* <Card>
            <CardContent align="center">
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE-BNB-LP" />
                </CardIcon>
              </Box>
              <h2>BSHARE-BNB PancakeSwap LP</h2>
              <Box mt={2}>
                <Button onClick={onPresentBshareZap} className="shinyButtonSecondary">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} BSHARE /
                  {bshareLPStats?.ftmAmount ? bshareLPStats?.ftmAmount : '-.--'} BNB
                </span>
              </Box>
              <Box>${bshareLPStats?.priceOfOne ? bshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: $
                {bshareLPStats?.totalLiquidity ? roundAndFormatNumber(bshareLPStats.totalLiquidity, 2) : '-.--'}
                <br />
                Total Supply: {bshareLPStats?.totalSupply ? roundAndFormatNumber(bshareLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card> */}
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
