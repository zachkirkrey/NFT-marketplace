import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsUSDT from '../../hooks/useLpStatsUSDT';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import _10MB from '../../bomb-finance/deployments/_10MB.json';
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

const TITLE = 'bomb.money | USDT pegged algocoin';

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
  const bombFtmLpStats = useLpStatsUSDT('10MB-USDT-LP');
  const bShareFtmLpStats = useLpStats('10SHARE-CRO-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();

  let bomb;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    bomb = _10MB;
  } else {
    bomb = _10MB;
  }

  const buyBombAddress =
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=' + bomb.address;
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=CRO&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInUSDT = useMemo(() => (bombStats ? Number(bombStats.tokenInUSDT).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInUSDT = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInUSDT).toFixed(4) : null),
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
  const tBondPriceInCRO = useMemo(
    () => (tBondStats ? (Number(tBondStats.tokenInUSDT) * 10).toFixed(4) : null),
    [tBondStats],
  );
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: '10MB-USDT-LP' });
  const bshareLpZap = useZap({ depositTokenName: '10SHARE-CRO-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'10MB-USDT-LP'}
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
      tokenName={'10SHARE-CRO-LP'}
    />,
  );

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      {/* <BackgroundImage /> */}
      <Alert variant="filled" severity="info" action={<Button href="https://bombUSDT.com">10MBUSDT.COM</Button>}>
        10MB USDT MAINNET STAKING!{' '}
        <a href="https://bombUSDT.com" style={{ color: 'inherit' }}>
          Stake Bitcoin from USDT Mainnet!
        </a>
      </Alert>

      <Grid container spacing={3}>
        {/* <Grid container spacing={3}>
          <Grid item xs={12} sm={12} justify="center" style={{ margin: '12px', display: 'flex' }}>
            <Alert variant="filled" severity="info" action={<Button href="https://bombUSDT.com">10MBUSDT.COM</Button>}>
              10MB USDT MAINNET STAKING! Stake Bitcoin from USDT Mainnet!
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
                    10MB is an algocoin which is designed to follow the price of USDT. Enjoy high yields normally only
                    found on high risk assets, but with exposure to USDT instead!
                  </p>
                  <p>
                    <strong>10MB is pegged via algorithm to a 10:1 ratio to USDT. $10 USDT = 100 10MB PEG</strong>
                    {/* Stake your _10MB-USDT LP in the Farm to earn 10SHARE rewards. Then stake your earned 10SHARE in the
                Boardroom to earn more _10MB! */}
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
                Buy 10MB
              </Button>
              <Button href={buyBShareAddress} className={'shinyButton ' + classes.button} style={{ margin: '5px' }}>
                Buy 10SHARE
              </Button>
              <Button
                target="_blank"
                href="https://dexscreener.com/bsc/0x84392649eb0bc1c1532f2180e58bae4e1dabd8d6"
                className="shinyButton"
                style={{ margin: '5px' }}
              >
                10MB Chart
              </Button>
              <Button
                target="_blank"
                href="https://dexscreener.com/bsc/0x1303246855b5b5ebc71f049fdb607494e97218f8"
                className="shinyButton"
                style={{ margin: '5px' }}
              >
                10SHARE Chart
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

        {/* _10MB */}
        <Grid item xs={12} md={4}>
          <TokenCard
            onMetamaskFoxIconClick={() => bombFinance.watchAssetInMetamask('10MB')}
            tokenSymbol="10MB"
            tokenName="10MB"
            topSubtext="10 10MB (1.0 Peg) ="
            mainText={`${bombPriceInUSDT ? (bombPriceInUSDT * 10).toFixed(2) : '-.----'} USDT`}
            bottomSubtext={`$${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'} / 10MB`}
            marketCap={`$${roundAndFormatNumber(bombCirculatingSupply * bombPriceInDollars, 2)}$`}
            circulatingSupply={roundAndFormatNumber(bombCirculatingSupply, 2)}
            totalSupply={roundAndFormatNumber(bombTotalSupply, 2)}
            price={<span className={classes.tombforkTokenPrice}>0.1 USDT</span>}
          />
        </Grid>

        {/* _10SHARE */}
        <Grid item xs={12} md={4}>
          <TokenCard
            onMetamaskFoxIconClick={() => bombFinance.watchAssetInMetamask('10SHARE')}
            tokenSymbol="10SHARE"
            tokenName="10SHARE"
            topSubtext="Current Price"
            mainText={`${bSharePriceInUSDT ? Number(bSharePriceInUSDT).toFixed(2) : '-.----'} USDT`}
            bottomSubtext={`$${bSharePriceInDollars ? bSharePriceInDollars : '-.--'} / 10SHARE`}
            marketCap={`$${roundAndFormatNumber((bShareCirculatingSupply * bSharePriceInDollars).toFixed(2), 2)}`}
            circulatingSupply={roundAndFormatNumber(bShareCirculatingSupply, 2)}
            totalSupply={roundAndFormatNumber(bShareTotalSupply, 2)}
            price={<span className={classes.governanceTokenPrice}>10000 USDT</span>}
          />
        </Grid>

        {/* _10BOND */}
        <Grid item xs={12} md={4}>
          <TokenCard
            onMetamaskFoxIconClick={() => bombFinance.watchAssetInMetamask('10BOND')}
            tokenSymbol="10BOND"
            tokenName="10BOND"
            topSubtext="10 10BOND"
            mainText={tBondPriceInCRO ? tBondPriceInCRO + ' USDT' : '-.----'}
            USDT
            bottomSubtext={`$${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / 10BOND`}
            marketCap={`$${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)}`}
            circulatingSupply={roundAndFormatNumber(tBondCirculatingSupply, 2)}
            totalSupply={roundAndFormatNumber(tBondTotalSupply, 2)}
            price={<span className={classes['10bondTokenPrice']}>-- USDT</span>}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TokenSwapCard
            title="10MB-USDT LP"
            // title="_10MB-USDT USDT LP"
            tokenSymbol="10MB-USDT-LP"
            onZapInClick={onPresentBombZap}
            zapInDisabled
            swapPrice={`${bombLPStats?.tokenAmount ? bombLPStats?.tokenAmount : '-.--'} 10MB / 
            ${bombLPStats?.croAmount ? bombLPStats?.croAmount : '-.--'} USDT`}
            price={`$${bombLPStats?.priceOfOne ? bombLPStats.priceOfOne : '-.--'}`}
            liquidity={`$${bombLPStats?.totalLiquidity ? roundAndFormatNumber(bombLPStats.totalLiquidity, 2) : '-.--'}`}
            totalSupply={`${bombLPStats?.totalSupply ? roundAndFormatNumber(bombLPStats.totalSupply, 2) : '-.--'}`}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TokenSwapCard
            title="10SHARE-CRO LP"
            // title="_10SHARE-CRO USDT LP"
            tokenSymbol="10SHARE-CRO-LP"
            onZapInClick={onPresentBombZap}
            swapPrice={`${bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} 10SHARE /
            ${bshareLPStats?.croAmount ? bshareLPStats?.croAmount : '-.--'} CRO`}
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
                  <TokenSymbol symbol="10SHARE-CRO-LP" />
                </CardIcon>
              </Box>
              <h2>_10SHARE-CRO USDT LP</h2>
              <Box mt={2}>
                <Button onClick={onPresentBshareZap} className="shinyButtonSecondary">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} _10SHARE /
                  {bshareLPStats?.croAmount ? bshareLPStats?.croAmount : '-.--'} CRO
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
