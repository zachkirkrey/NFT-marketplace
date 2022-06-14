import { useCallback } from 'react';
import useBombFinance from './useBombFinance';
import { Bank } from '../bomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useWNFTithdraw = (bank: Bank) => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleNFTWithdraw = useCallback(
    (_slot: number) => {
      handleTransactionReceipt(
        bombFinance.nftUnstake(bank.contract, _slot, bank.poolId),
        `Withdraw NFT in slot ${_slot} from ${bank.contract}`,
      );
    },
    [bank, bombFinance, handleTransactionReceipt],
  );
  return { onNFTWithdraw: handleNFTWithdraw };
};

export default useWNFTithdraw;
