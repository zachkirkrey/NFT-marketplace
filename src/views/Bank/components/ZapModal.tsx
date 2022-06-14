import React, { useState, useMemo } from 'react';

import { Button, Select, MenuItem, InputLabel, withStyles } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useBombFinance from '../../../hooks/useBombFinance';
import { useWallet } from 'use-wallet';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { _10MB_TICKER, _10SHARE_TICKER, CRO_TICKER, USDC_TICKER } from '../../../utils/constants';
import { Alert } from '@material-ui/lab';

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string) => void;
  tokenName?: string;
  decimals?: number;
}

const ZapModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, tokenName = '', decimals = 18 }) => {
  const bombFinance = useBombFinance();
  const { balance } = useWallet();
  const croBalance = (Number(balance) / 1e18).toFixed(4).toString();
  const bombBalance = useTokenBalance(bombFinance["10MB"]);
  const bshareBalance = useTokenBalance(bombFinance["10SHARE"]);
  const USDCalance = useTokenBalance(bombFinance.USDC);
  const [val, setVal] = useState('');
  const [zappingToken, setZappingToken] = useState(CRO_TICKER);
  const [zappingTokenBalance, setZappingTokenBalance] = useState(croBalance);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be CRO in this case
  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);
  /*
  const bombFtmLpStats = useLpStats('10MB-USDC LP');
  const tShareFtmLpStats = useLpStats('10SHARE-CRO LP');
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const croAmountPerLP = tokenName.startsWith(_10MB_TICKER) ? bombLPStats?.croAmount : bshareLPStats?.croAmount;*/
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  const handleChangeAsset = (event: any) => {
    const value = event.target.value;
    setZappingToken(value);
    setZappingTokenBalance(croBalance);
    if (event.target.value === _10SHARE_TICKER) {
      setZappingTokenBalance(getDisplayBalance(bshareBalance, decimals));
    }
    if (event.target.value === _10MB_TICKER) {
      setZappingTokenBalance(getDisplayBalance(bombBalance, decimals));
    }
    if (event.target.value === USDC_TICKER) {
      setZappingTokenBalance(getDisplayBalance(USDCalance, decimals));
    }
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
    const estimateZap = await bombFinance.estimateZapIn(zappingToken, tokenName, String(e.currentTarget.value));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSelectMax = async () => {
    const isPreview = false

    if (isPreview) {
      alert("Please wait for the site to be fully online!")
      return
    }

    setVal(zappingTokenBalance);
    const estimateZap = await bombFinance.estimateZapIn(zappingToken, tokenName, String(zappingTokenBalance));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  return (
    <Modal>
      <ModalTitle text={`Zap in ${tokenName}`} />

      <StyledActionSpacer />
      <InputLabel style={{ color: '#2c2560' }} id="label">
        Select asset to zap with
      </InputLabel>
      <Select
        onChange={handleChangeAsset}
        style={{ color: '#2c2560' }}
        labelId="label"
        id="select"
        value={zappingToken}
      >
        <StyledMenuItem value={CRO_TICKER}>CRO</StyledMenuItem>
        <StyledMenuItem value={_10SHARE_TICKER}>10SHARE</StyledMenuItem>
        {/* <StyledMenuItem value={USDC_TICKER}>USDC</StyledMenuItem> */}
        {/* Bomb as an input for zapping will be disabled due to issues occuring with the Gatekeeper system */}
        {/* <StyledMenuItem value={_10MB_TICKER}>_10MB</StyledMenuItem> */}
      </Select>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />
      <Label text="Zap Estimations" />
      <StyledDescriptionText>
        {' '}
        {tokenName}: {Number(estimate.token0) / Number(/*croAmountPerLP*/ 1)}
      </StyledDescriptionText>
      <StyledDescriptionText>
        {' '}
        ({Number(estimate.token0)} {tokenName.startsWith(_10SHARE_TICKER) ? _10SHARE_TICKER : CRO_TICKER} /{' '}
        {Number(estimate.token1)} {tokenName.startsWith(_10SHARE_TICKER) ? CRO_TICKER : _10SHARE_TICKER}){' '}
      </StyledDescriptionText>
      <ModalActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>{
            const isPreview = false

            if (isPreview) {
              alert("Please wait for the site to be fully online!")
              return
            }

            approveZapperStatus !== ApprovalState.APPROVED ? approveZapper() : onConfirm(zappingToken, tokenName, val)
          }}
        >
          {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve' : "Let's go"}
        </Button>
      </ModalActions>

      <StyledActionSpacer />
      <Alert variant="filled" severity="info">
        New feature. Use at your own risk!
      </Alert>
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDescriptionText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 22px;
  justify-content: flex-start;
`;
const StyledMenuItem = withStyles({
  root: {
    backgroundColor: 'white',
    color: '#2c2560',
    '&:hover': {
      backgroundColor: 'grey',
      color: '#2c2560',
    },
    selected: {
      backgroundColor: 'black',
    },
  },
})(MenuItem);

export default ZapModal;
