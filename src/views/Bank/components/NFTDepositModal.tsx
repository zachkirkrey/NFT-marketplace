import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import IntegerTokenInput from '../../../components/IntegerTokenInput';

import { BigNumber } from 'ethers';

interface NFTDepositModalProps extends ModalProps {
  max: BigNumber;
  decimals: number;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const NFTDepositModal: React.FC<NFTDepositModalProps> = ({ max, decimals, onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('');

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );


  return (
    <Modal>
      <ModalTitle text={`Deposit ${tokenName} by TokenID`} />
      <IntegerTokenInput
        value={val}
        onChange={handleChange}
        symbol={tokenName}
      />
      <ModalActions>
        {/* <Button color="secondary" variant="outlined" onClick={onDismiss}>Cancel</Button> */}
        <Button className="shinyButtonSecondary" onClick={() => onConfirm(val)}>
          Confirm
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default NFTDepositModal;
