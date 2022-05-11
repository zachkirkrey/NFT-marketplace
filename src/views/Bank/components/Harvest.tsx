import React, { useMemo } from 'react';

import { Box, Button, Paper, Typography } from '@material-ui/core';
import Value from '../../../components/Value';
import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';

import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../bomb-finance';
import useBombStats from '../../../hooks/useBombStats';
import useShareStats from '../../../hooks/usebShareStats';
import Label from '../../../components/Label';

interface HarvestProps {
  bank: Bank;
}

const Harvest: React.FC<HarvestProps> = ({ bank }) => {
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const { onReward } = useHarvest(bank);
  const bombStats = useBombStats();
  const tShareStats = useShareStats();

  console.log('bombStats ', bombStats);
  console.log('tShareStats ', tShareStats);

  const tokenName = bank.earnTokenName === '_10SHARE' ? '_10SHARE' : '_10MB';
  const tokenStats = bank.earnTokenName === '_10SHARE' ? tShareStats : bombStats;
  const tokenPriceInDollars = tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null;
  console.log('tokenPriceInDollars ', tokenPriceInDollars);
  console.log('earnings ', earnings.toString());
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  console.log('earnedInDollars ', earnedInDollars);
  return (
    <Paper>
      <Box display="flex" flexDirection="column" alignItems="center" px={3} py={6}>
        <TokenSymbol symbol={bank.earnToken.symbol} />
        <Box mt={3} mb={1}>
          <Value value={getDisplayBalance(earnings)} />
        </Box>
        <Box mb={5} textAlign="center">
          <Typography style={{ textTransform: 'uppercase', color: '#fffff' }}>{`≈ $${earnedInDollars}`}</Typography>
          <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>{`${tokenName} Earned`}</Typography>
        </Box>
        <Button
          onClick={onReward}
          disabled={earnings.eq(0)}
          className={earnings.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
        >
          Claim
        </Button>
      </Box>
    </Paper>
  );
};

export default Harvest;
