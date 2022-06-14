import React from 'react';
import { Box, Card, Grid, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import TokenSymbol from '../../components/TokenSymbol';
import coinmarketIcon from '../../assets/img/coinmarket.svg';
import coingeckoIcon from '../../assets/img/coingecko.svg';
import metamaskIcon from '../../assets/img/metamask.svg';
import LaunchIcon from '@material-ui/icons/Launch';
import { withStyles } from '@material-ui/styles';

type TokenCardProps = {
  onMetamaskFoxIconClick: () => void;
  tokenSymbol: string;
  tokenName: string;
  topSubtext: string;
  mainText: string;
  bottomSubtext: string;
  marketCap: string;
  circulatingSupply: string;
  totalSupply: string;
  price: string | React.ReactNode;
};

const useClasses = makeStyles({
  metamaskFoxButton: {
    background: 'hsla(0,0%,100%,.1)',
    borderRadius: '100px',
    width: 50,
    height: 24,
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    marginRight: 12,
    cursor: 'pointer',
    transition: 'all .6s',
    border: 0,
    fontWeight: 'bold',

    '& img': {
      marginLeft: 4,
    },

    '&:hover': {
      background: 'hsla(0,0%,100%,.3)',
    },
  },
  marketLink: {
    display: 'flex',
    marginRight: 12,
  },
  marketIcon: {
    width: 20,
    height: 20,
  },
  tokenNameAndLinks: {
    marginBottom: -12,
  },
});

const StyledPaper = withStyles({
  root: {
    textAlign: 'center',
    backgroundColor: '#043378',
  },
})(Paper);

const CurrentPricePaper = withStyles({
  root: {
    background: '#001a42',
  },
})(Paper);

const Header = withStyles({
  root: {
    textAlign: 'left',
    borderBottom: '1px solid hsla(0,0%,100%,.1)',
  },
})(Box);

const StyledIconButton = withStyles((theme) => ({
  root: {
    marginLeft: -12,
    color: theme.palette.text.secondary,
  },
}))(IconButton);

const TokenName = withStyles((theme) => ({
  root: {
    color: theme.palette.text.yellow,
    fontWeight: 700,
  },
}))(Typography);

export const TokenCard: React.FC<TokenCardProps> = ({
  onMetamaskFoxIconClick,
  tokenSymbol,
  tokenName,
  topSubtext,
  mainText,
  bottomSubtext,
  marketCap,
  circulatingSupply,
  totalSupply,
  price,
}) => {
  const classes = useClasses();

  const isPreview = false

  return (
    <StyledPaper style={{ position: 'relative' }}>
      <Header display="flex" alignItems="center" p={[2, 3]}>
        <Box display="flex" mr={2}>
          <TokenSymbol symbol={tokenSymbol} size={48} />
        </Box>
        <div className={classes.tokenNameAndLinks}>
          <TokenName>{tokenName}</TokenName>
          <Box display="flex" alignItems="center">
            {/*<a href="https://coinmarketcap.com/currencies/darkcrypto/" className={classes.marketLink}>
              <img alt="coinmarket" src={coinmarketIcon} className={classes.marketIcon} />
            </a>
            <a href="https://www.coingecko.com/en/coins/darkcrypto" className={classes.marketLink}>
              <img alt="coingecko" src={coingeckoIcon} className={classes.marketIcon} />
            </a>*/}
            <img className={classes.marketLink} alt="coinmarket" src={coinmarketIcon}  />
            <img className={classes.marketLink} alt="coingecko" src={coingeckoIcon} />
            <button
              className={classes.metamaskFoxButton}
              onClick={() => {
                onMetamaskFoxIconClick();
              }}
            >
              +
              <img alt="metamask fox" src={metamaskIcon} className={classes.marketIcon} />
            </button>
            <StyledIconButton>
              <a style={{color: 'white'}} href='' target="_blank">
                <LaunchIcon />
              </a>
            </StyledIconButton>
          </Box>
        </div>
      </Header>
      <Box p={2}>
        <Box mb={3}>
          <CurrentPricePaper elevation={0}>
            <Box py={1} px={2} textAlign="left">
              Price: <b>{price}</b>
            </Box>
          </CurrentPricePaper>
        </Box>

        <Box mb={3}>
          {/* <CurrentPricePaper elevation={0}>
            <Box px={2} py={3}>
              {topSubtext}
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>{mainText}</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>{bottomSubtext}</span>
              </Box>
            </Box>
          </CurrentPricePaper> */}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <span>Market Cap:</span>
              <span>{isPreview ? '$0.00' : marketCap}</span>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <span>Circulating Supply:</span>
              <span>{isPreview ? '0.00' : circulatingSupply}</span>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <span>Total Supply:</span>
              <span>{isPreview ? '0.00' : totalSupply}</span>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </StyledPaper>
  );
};
