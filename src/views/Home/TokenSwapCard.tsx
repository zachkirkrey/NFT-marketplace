import { Box, Button, Card, CardContent, Grid, withStyles } from '@material-ui/core';
import React from 'react';
import TokenSymbol from '../../components/TokenSymbol';

type TokenSwapCardProps = {
  title: string;
  tokenSymbol: string;
  onZapInClick: () => void;
  zapInDisabled?: boolean;
  swapPrice: string;
  price: string;
  liquidity: string;
  totalSupply: string;
};

const ZapInButton = withStyles({
  root: {
    backgroundColor: '#f9d749',
    color: '#000',
    width: 128,
    height: 56,
  },
})(Button);

export const TokenSwapCard: React.FC<TokenSwapCardProps> = ({
  title,
  tokenSymbol,
  onZapInClick,
  zapInDisabled = false,
  swapPrice,
  price,
  liquidity,
  totalSupply,
}) => (
  <Card>
    <CardContent>
      <Box display={['block', 'block', 'block', 'flex']} alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Box display="flex" mr={2}>
            <TokenSymbol symbol={tokenSymbol} />
          </Box>
          <div>
            <h2>{title}</h2>
            <span style={{ fontSize: '18px' }}>{swapPrice}</span>
          </div>
        </Box>
        <Box ml="auto" my={[1, 1, 1, 0]} px={[0, 0, 0, 2]}>
          {price}
        </Box>
        <ZapInButton
          onClick={onZapInClick}
          disabled={zapInDisabled}
          // className={zapInDisabled ? 'shinyButtonDisabledSecondary' : 'shinyButtonSecondary'}
          color="primary"
          size="large"
        >
          Zap In
        </ZapInButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <span>Liquidity:</span>
            <span>{liquidity}</span>
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
  </Card>
);
