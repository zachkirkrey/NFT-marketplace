import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsUSDC from '../../hooks/useLpStatsUSDC';
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
import tenWhiteImg from '../../assets/img/10-large.png';

import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import BombImage from '../../assets/img/10mb_bomb_2.png';

import { withStyles } from '@material-ui/styles';
import { bgGradient, bgGradientHighlighted } from '../../theme/colors';
import { TokenCard } from './TokenCard';
import { TokenSwapCard } from './TokenSwapCard';
import { PromotedTokenCard } from './PromotedTokenCard';

const TITLE = '10mb.finance | USDC pegged algocoin';

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
  /*
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
  */
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
  const bombFtmLpStats = useLpStatsUSDC('10MB-USDC LP');
  const bShareFtmLpStats = useLpStats('10SHARE-CRO LP');
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
  const bombPriceInUSDC = useMemo(() => (bombStats ? Number(bombStats.tokenInUSDC).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInUSDC = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInUSDC).toFixed(4) : null),
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
    () => (tBondStats ? (Number(tBondStats.tokenInUSDC) * 10).toFixed(4) : null),
    [tBondStats],
  );
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: '10MB-USDC LP' });
  const bshareLpZap = useZap({ depositTokenName: '10SHARE-CRO LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'10MB-USDC LP'}
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
      tokenName={'10SHARE-CRO LP'}
    />,
  );

  const isPreview = false

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      {/* <BackgroundImage /> */}
      <Alert variant="filled" severity="info">
      10mb Finance is the first algorithmic stablecoin that uses both Seignorage and Fractional Collateralization as peg enforcement mechanisms!
      </Alert>
      <Alert style={{marginTop: '1.2rem'}} variant="filled" severity="error">
        <b>Our presale begins June 28! Please see our <a href="https://docs.10mb.finance/basics/presale-launch-info" target="_blank" >Docs</a> for more information!</b>
      </Alert>

      <Grid container spacing={3}>
        {/* <Grid container spacing={3}>
          <Grid item xs={12} sm={12} justify="center" style={{ margin: '12px', display: 'flex' }}>
            <Alert variant="filled" severity="info" action={<Button href="https://bombUSDC.com">10MBUSDC.COM</Button>}>
              10MB USDC MAINNET STAKING! Stake Bitcoin from USDC Mainnet!
            </Alert>
          </Grid>
        </Grid> */}

        {/* TVL */}
        <Grid item>
          <JumbotronPaper>
            <img src={BombImage} alt="10mb.finance" className={classes.jumbotronImage} />
            <Box p={[2, 2, 4]} className={classes.jumbotronText}>
              <Box display={['block', 'block', 'flex']} alignItems="start">
                <Box flex={1} mr={3}>
                  <h2>Welcome to 10mb</h2>
                  <p>
                  10mb is an algorithmic stablecoin pegged to 0.1 USDC by two different mechanisms: Seignorage and Fractional Collateralization. Enjoy yields normally found on high-risk assets, but with exposure to USDC instead!
                  </p>
                  <p>
                    <strong>10mb is pegged in a 10:1 ratio to USDC, so at peg, 100 10mb = 10 USDC</strong>
                    {/* Stake your _10MB-USDC LP in the Farm to earn 10SHARE rewards. Then stake your earned 10SHARE in the
                Boardroom to earn more _10MB! */}
                  </p>
                  <p>
                    <IconTelegram alt="telegram" style={{ fill: '#dddfee', height: '15px' }} /> Join our{' '}
                    <a
                      href="https://t.me/PolyWantsACracker_Farm"
                      rel="noopener noreferrer"
                      target="_blank"
                      style={{ color: '#dddfee' }}
                    >
                      Telegram
                    </a>{' '}
                    or{' '}
                    <a
                      href="https://discord.gg/raxn6h9vy5"
                      rel="noopener noreferrer"
                      target="_blank"
                      style={{ color: '#dddfee' }}
                    >
                      Discord
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

            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button onClick={()=> {

                    if (isPreview) {
                      alert("Please wait for the site to be fully online!")
                      return
                    }
              }} target="_blank"  href={isPreview ? '' : buyBombAddress} style={{ margin: '5px' }} className={'shinyButton ' + classes.button}>
                Buy 10MB
              </Button>
              <Button onClick={()=> {

if (isPreview) {
  alert("Please wait for the site to be fully online!")
  return
}
}}
target="_blank" href={isPreview ? '' : buyBShareAddress} className={'shinyButton ' + classes.button} style={{ margin: '5px' }}>
                Buy 10SHARE
              </Button>
              <Button
                onClick={()=> {

                  if (isPreview) {
                    alert("Please wait for the site to be fully online!")
                    return
                  }
            }}
            target="_blank"
                href={isPreview ? '' : "https://dexscreener.com/bsc/0x84392649eb0bc1c1532f2180e58bae4e1dabd8d6"}
                className="shinyButton"
                style={{ margin: '5px' }}
              >
                10MB Chart
              </Button>
              <Button
                onClick={()=> {

                  if (isPreview) {
                    alert("Please wait for the site to be fully online!")
                    return
                  }
            }}
            target="_blank"
                href={isPreview ? '' : "https://dexscreener.com/bsc/0x1303246855b5b5ebc71f049fdb607494e97218f8"}
                className="shinyButton"
                style={{ margin: '5px' }}
              >
                10SHARE Chart
              </Button>
            </CardContent>

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
            mainText={`${isPreview ? '0.00' : bombPriceInUSDC ? (bombPriceInUSDC * 10).toFixed(2) : '-.----'} USDC`}
            bottomSubtext={`$${isPreview ? '0.00' : bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'} / 10MB`}
            marketCap={`$${isPreview ? '0.00' : roundAndFormatNumber(bombCirculatingSupply * bombPriceInDollars, 2)}$`}
            circulatingSupply={isPreview ? '0.00' : roundAndFormatNumber(bombCirculatingSupply, 2)}
            totalSupply={isPreview ? '0.00' : roundAndFormatNumber(bombTotalSupply, 2)}
            price={<span className={classes.tombforkTokenPrice}>0.1 USDC</span>}
          />
        </Grid>

        {/* _10SHARE */}
        <Grid item xs={12} md={4}>
          <TokenCard
            onMetamaskFoxIconClick={() => bombFinance.watchAssetInMetamask('10SHARE')}
            tokenSymbol="10SHARE"
            tokenName="10SHARE"
            topSubtext="Current Price"
            mainText={`${isPreview ? '0.00' : bSharePriceInUSDC ? Number(bSharePriceInUSDC).toFixed(2) : '-.----'} USDC`}
            bottomSubtext={`$${isPreview ? '0.00' : bSharePriceInDollars ? bSharePriceInDollars : '-.--'} / 10SHARE`}
            marketCap={`$${isPreview ? '0.00' : roundAndFormatNumber((bShareCirculatingSupply * bSharePriceInDollars).toFixed(2), 2)}`}
            circulatingSupply={isPreview ? '0.00' : roundAndFormatNumber(bShareCirculatingSupply, 2)}
            totalSupply={isPreview ? '0.00' : roundAndFormatNumber(bShareTotalSupply, 2)}
            price={<span className={classes.governanceTokenPrice}>1000 USDC</span>}
          />
        </Grid>

        {/* _10BOND */}
        <Grid item xs={12} md={4}>
          <TokenCard
            onMetamaskFoxIconClick={() => bombFinance.watchAssetInMetamask('10BOND')}
            tokenSymbol="10BOND"
            tokenName="10BOND"
            topSubtext="10 10BOND"
            mainText={tBondPriceInCRO ? tBondPriceInCRO + ' USDC' : '-.----'}
            USDC
            bottomSubtext={`$${isPreview ? '0.00' : tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / 10BOND`}
            marketCap={`$${isPreview ? '0.00' : roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)}`}
            circulatingSupply={isPreview ? '0.00' : roundAndFormatNumber(tBondCirculatingSupply, 2)}
            totalSupply={isPreview ? '0.00' : roundAndFormatNumber(tBondTotalSupply, 2)}
            price={<span className={classes['10bondTokenPrice']}>-- USDC</span>}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TokenSwapCard
            title="10MB-USDC LP"
            // title="_10MB-USDC USDC LP"
            tokenSymbol="10MB-USDC LP"
            onZapInClick={onPresentBombZap}
            zapInDisabled
            swapPrice={`${isPreview ? '0.00' : bombLPStats?.tokenAmount ? bombLPStats?.tokenAmount : '-.--'} 10MB / 
            ${isPreview ? '0.00' : bombLPStats?.croAmount ? bombLPStats?.croAmount : '-.--'} USDC`}
            price={`$${isPreview ? '0.00' : bombLPStats?.priceOfOne ? bombLPStats.priceOfOne : '-.--'}`}
            liquidity={`$${isPreview ? '0.00' : bombLPStats?.totalLiquidity ? roundAndFormatNumber(bombLPStats.totalLiquidity, 2) : '-.--'}`}
            totalSupply={`${isPreview ? '0.00' : bombLPStats?.totalSupply ? roundAndFormatNumber(bombLPStats.totalSupply, 2) : '-.--'}`}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TokenSwapCard
            title="10SHARE-USDC LP"
            // title="_10SHARE-USDC LP"
            tokenSymbol="10SHARE-USDC LP"
            onZapInClick={onPresentBombZap}
            swapPrice={`${isPreview ? '0.00' : bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} 10SHARE /
            ${isPreview ? '0.00' : bshareLPStats?.croAmount ? bshareLPStats?.croAmount : '-.--'} USDC`}
            price={`$${isPreview ? '0.00' : bshareLPStats?.priceOfOne ? bshareLPStats.priceOfOne : '-.--'}`}
            liquidity={`$${isPreview ? '0.00' : 
              bshareLPStats?.totalLiquidity ? roundAndFormatNumber(bshareLPStats.totalLiquidity, 2) : '-.--'
            }`}
            totalSupply={isPreview ? '0.00' : bshareLPStats?.totalSupply ? roundAndFormatNumber(bshareLPStats.totalSupply, 2) : '-.--'}
          />
          {/* <Card>
            <CardContent align="center">
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="10SHARE-CRO LP" />
                </CardIcon>
              </Box>
              <h2>_10SHARE-CRO USDC LP</h2>
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
