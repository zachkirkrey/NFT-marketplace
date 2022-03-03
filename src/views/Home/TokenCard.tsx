import React from 'react';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import TokenSymbol from '../../components/TokenSymbol';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
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
};

const StyledCard = withStyles({
  root: {
    textAlign: 'center',
  },
})(Card);

const CurrentPricePaper = withStyles({
  // elevation: 0,
  root: {
    background: '#001a42',
  },
})(Paper);

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
}) => (
  <StyledCard>
    <CardContent style={{ position: 'relative' }}>
      <Box mt={2}>
        <TokenSymbol symbol={tokenSymbol} />
      </Box>
      <Button
        onClick={() => {
          onMetamaskFoxIconClick();
        }}
        style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
      >
        {' '}
        <b>+</b>&nbsp;&nbsp;
        <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
      </Button>
      <Box mb={3}>
        <h2>{tokenName}</h2>
      </Box>
      <Box mb={3}>
        <CurrentPricePaper elevation={0}>
          <Box px={2} py={3}>
            {topSubtext}
            <Box>
              <span style={{ fontSize: '30px', color: 'white' }}>{mainText}</span>
            </Box>
            <Box>
              <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>{bottomSubtext}</span>
            </Box>
          </Box>
        </CurrentPricePaper>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <span>Market Cap:</span>
            <span>{marketCap}</span>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <span>Circulating Supply:</span>
            <span>{circulatingSupply}</span>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <span>Total Supply:</span>
            <span>{totalSupply}</span>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </StyledCard>
);
