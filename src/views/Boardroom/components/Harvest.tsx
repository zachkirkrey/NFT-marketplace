import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, makeStyles, Paper, Typography, withStyles } from '@material-ui/core';

import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useClaimRewardTimerBoardroom from '../../../hooks/boardroom/useClaimRewardTimerBoardroom';
import useClaimRewardCheck from '../../../hooks/boardroom/useClaimRewardCheck';
import ProgressCountdown from './ProgressCountdown';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import useBombStats from '../../../hooks/useBombStats';
import { getDisplayBalance } from '../../../utils/formatBalance';

const useClasses = makeStyles({
  badge: {
    borderTop: `86px solid rgb(255, 214, 0)`,
    borderRight: `86px solid transparent`,
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '21px',
    color: 'rgb(0, 0, 0)',
  },
});

const RelativePaper = withStyles({
  root: {
    position: 'relative',
    overflow: 'hidden',
  },
})(Paper);

const BadgeText = withStyles({
  root: {
    fontWeight: 700,
    left: 4,
    transform: 'rotate(-45deg)',
    position: 'absolute',
    top: -66,
  },
})(Typography);

const Harvest: React.FC = () => {
  const classes = useClasses();
  const bombStats = useBombStats();
  const { onReward } = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();

  const tokenPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const { from, to } = useClaimRewardTimerBoardroom();

  const isPreview = false

  return (
    <RelativePaper>
      <div className={classes.badge}>
        <BadgeText variant="body2">Reward</BadgeText>
      </div>
      <Box display="flex" flexDirection="column" alignItems="center" px={3} py={6}>
        <TokenSymbol symbol="10MB" />
        <Box mt={3} mb={1}>
          <Value value={getDisplayBalance(earnings)} />
        </Box>
        <Box mb={5} textAlign="center">
          <Label text={`≈ $${earnedInDollars}`} variant="yellow" />
          <Label text="10MB Earned" variant="yellow" />
        </Box>
        <Button
          fullWidth
          onClick={() => {
            if (isPreview) {
              alert("Please wait for the site to be fully online!")
              return
            }
            onReward()
          }}
          className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
          disabled={earnings.eq(0) || !canClaimReward}
        >
          Claim Reward
        </Button>
        {canClaimReward ? null : (
          <Box mt={2} style={{ color: '#FFF' }}>
            <>
              <Typography style={{ textAlign: 'center' }}>Claim possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Claim available in" />
            </>
          </Box>
        )}
      </Box>
    </RelativePaper>
  );
};

export default Harvest;
