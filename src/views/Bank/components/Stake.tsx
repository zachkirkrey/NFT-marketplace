import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';

// import Button from '../../../components/Button';
import { Box, Button, Card, CardContent, Paper, Typography } from '@material-ui/core';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import IconButton from '../../../components/IconButton';
//import Label from '../../../components/Label';
import Value from '../../../components/Value';
import { ThemeContext } from 'styled-components';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useZap from '../../../hooks/useZap';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import ZapModal from './ZapModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../bomb-finance';

interface StakeProps {
  bank: Bank;
}

const Stake: React.FC<StakeProps> = ({ bank }) => {
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);

  const { color: themeColor } = useContext(ThemeContext);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);
  const { onStake } = useStake(bank);
  const { onZap } = useZap(bank);
  const { onWithdraw } = useWithdraw(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentZap, onDissmissZap] = useModal(
    <ZapModal
      decimals={bank.depositToken.decimal}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onZap(zappingToken, tokenName, amount);
        onDissmissZap();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <Paper>
      <Box display="flex" flexDirection="column" alignItems="center" px={3} py={6}>
        <TokenSymbol symbol={bank.depositToken.symbol} />
        <Box mt={3} mb={1}>
          <Value value={getDisplayBalance(stakedBalance, bank.depositToken.decimal)} />
        </Box>

        {/* <Label text={`≈ $${earnedInDollars}`} /> */}
        <Box mb={5} textAlign="center">
          <Typography style={{ textTransform: 'uppercase', color: '#fffff' }}>{`≈ $${earnedInDollars}`}</Typography>
          <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>
            {`${bank.depositTokenName} Staked`}
          </Typography>
        </Box>
        {/* <Label text={`${bank.depositTokenName} Staked`} /> */}
        {approveStatus !== ApprovalState.APPROVED ? (
          <Button
            disabled={
              bank.closedForStaking ||
              approveStatus === ApprovalState.PENDING ||
              approveStatus === ApprovalState.UNKNOWN
            }
            onClick={approve}
            className={
              bank.closedForStaking ||
              approveStatus === ApprovalState.PENDING ||
              approveStatus === ApprovalState.UNKNOWN
                ? 'shinyButtonDisabled'
                : 'shinyButton'
            }
          >
            {`Approve ${bank.depositTokenName}`}
          </Button>
        ) : (
          <>
            <IconButton onClick={onPresentWithdraw}>
              <RemoveIcon />
            </IconButton>
            <StyledActionSpacer />
            <IconButton
              disabled={
                bank.closedForStaking ||
                bank.depositTokenName === 'BOMB-BSHARE-LP' ||
                bank.depositTokenName === 'BOMB-BTCB-LP'
              }
              onClick={() => (bank.closedForStaking ? null : onPresentZap())}
            >
              <FlashOnIcon style={{ color: themeColor.grey[400] }} />
            </IconButton>
            <StyledActionSpacer />
            <IconButton
              disabled={bank.closedForStaking}
              onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
            >
              <AddIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Paper>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

export default Stake;
