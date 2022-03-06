import React, { useMemo } from 'react';

import { Box, Button, Card, CardContent, makeStyles, Paper, Typography, withStyles } from '@material-ui/core';

import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdrawCheck from '../../../hooks/boardroom/useWithdrawCheck';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useBombFinance from '../../../hooks/useBombFinance';
import ProgressCountdown from './ProgressCountdown';
import useStakedBalanceOnBoardroom from '../../../hooks/useStakedBalanceOnBoardroom';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useUnstakeTimerBoardroom from '../../../hooks/boardroom/useUnstakeTimerBoardroom';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToBoardroom from '../../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../../hooks/useWithdrawFromBoardroom';

const useClasses = makeStyles({
  badge: {
    borderTop: `86px solid rgb(17, 154, 250)`,
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
    left: 10,
    transform: 'rotate(-45deg)',
    position: 'absolute',
    top: -66,
  },
})(Typography);

const Stake: React.FC = () => {
  const classes = useClasses();
  const bombFinance = useBombFinance();
  const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);

  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const stakedBalance = useStakedBalanceOnBoardroom();
  const { from, to } = useUnstakeTimerBoardroom();

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
  const tokenPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );

  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();
  const canWithdrawFromBoardroom = useWithdrawCheck();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BShare'}
    />,
  );

  return (
    <RelativePaper>
      <div className={classes.badge}>
        <BadgeText variant="body2">Stake</BadgeText>
      </div>
      <Box display="flex" flexDirection="column" alignItems="center" px={3} py={6}>
        <TokenSymbol symbol="BSHARE" />
        <Box mt={3} mb={1}>
          <Value value={getDisplayBalance(stakedBalance)} />
        </Box>
        <Box mb={5} textAlign="center">
          <Label text={`≈ $${tokenPriceInDollars}`} variant="yellow" />
          <Label text={'BSHARE Staked'} variant="yellow" />
        </Box>
        {approveStatus !== ApprovalState.APPROVED ? (
          <Button
            fullWidth
            disabled={approveStatus !== ApprovalState.NOT_APPROVED}
            className={approveStatus === ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'}
            onClick={approve}
          >
            Approve BSHARE
          </Button>
        ) : (
          <>
            <IconButton disabled={!canWithdrawFromBoardroom} onClick={onPresentWithdraw}>
              <RemoveIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
            </IconButton>
            <IconButton onClick={onPresentDeposit}>
              <AddIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
            </IconButton>
          </>
        )}
        {canWithdrawFromBoardroom ? null : (
          <Box mt={2} style={{ color: '#FFF' }}>
            <Card>
              <CardContent>
                <Typography style={{ textAlign: 'center' }}>Withdraw possible in</Typography>
                <ProgressCountdown hideBar={true} base={from} deadline={to} description="Withdraw available in" />
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </RelativePaper>
  );
};

export default Stake;
