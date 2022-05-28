import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Paper } from '@material-ui/core';

import { BigNumber } from 'ethers';
// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
//import useXbombBalance from '../../../hooks/useXbombBalance';
import useBombStats from '../../../hooks/useBombStats';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import MetamaskFox from '../../../assets/img/metamask-fox.svg';
import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useBombFinance from '../../../hooks/useBombFinance';
//import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';   //May not be needed anymore.
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToBomb from '../../../hooks/useStakeToBomb';
import useWithdrawFromBomb from '../../../hooks/useWithdrawFromBomb';
import useXbombBalance from '../../../hooks/useXbombBalance';

const Stake: React.FC = () => {
  const bombFinance = useBombFinance();
  const bombStats = useBombStats();

  const [approveStatus, approve] = useApprove(bombFinance["10MB"], bombFinance.contracts.x_10MB.address);

  const tokenBalance = useTokenBalance(bombFinance["10MB"]);
  //const stakedBalance = useStakedBomb();
  const stakedBalance =  BigNumber.from(0)//useTokenBalance(bombFinance.X_10MB);

  const xbombBalance = useXbombBalance();
  const xbombRate = Number(xbombBalance) / 1000000000000000000;
  const xbombToBombEquivalent = Number(getDisplayBalance(stakedBalance)) * xbombRate;

  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const stakedTokenPriceInDollars = Number(bombPriceInDollars) * xbombRate;

  const tokenPriceInDollars = useMemo(() => {
    return stakedTokenPriceInDollars
      ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
      : null;
  }, [stakedTokenPriceInDollars, stakedBalance]);
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const { onStake } = useStakeToBomb();
  const { onWithdraw } = useWithdrawFromBomb();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'10MB'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'x_10MB'}
    />,
  );

  return (
    <Paper style={{ position: 'relative' }}>
      <Box display="flex" flexDirection="column" alignItems="center" px={3} py={6}>
        <TokenSymbol symbol="X_10MB" />
        <Button
          className={'shinyButton'}
          onClick={() => {
            bombFinance.watchAssetInMetamask('X_10MB');
          }}
          style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
        >
          {' '}
          <b>+</b>&nbsp;&nbsp;
          <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
        </Button>
        <Box mt={3} mb={1}>
          <Value value={getDisplayBalance(stakedBalance)} />
        </Box>
        <Box mb={5} textAlign="center">
          <Label text={'x_10MB Balance'} variant="yellow" />
          <Label text={`≈ ${xbombToBombEquivalent.toFixed(2)} 10MB / $${tokenPriceInDollars}`} variant="yellow" />
        </Box>
        {approveStatus !== ApprovalState.APPROVED ? (
          <Button
            disabled={approveStatus !== ApprovalState.NOT_APPROVED}
            className={approveStatus === ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'}
            onClick={approve}
          >
            Approve 10MB
          </Button>
        ) : (
          <>
            <IconButton onClick={onPresentWithdraw}>
              <RemoveIcon color={'yellow'} />
            </IconButton>
            <StyledActionSpacer />
            <IconButton onClick={onPresentDeposit}>
              <AddIcon color={'yellow'} />
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
