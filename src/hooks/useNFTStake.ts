import { useCallback } from 'react';
import useBombFinance from './useBombFinance';
import { Bank } from '../bomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useNFTStake = (bank: Bank) => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleNFTStake = useCallback(
    (_nft: string, _tokenId: number, _slot: number) => {
      handleTransactionReceipt(
        bombFinance.nftStake(bank.contract, _nft, _tokenId, _slot, bank.poolId),
        `Stake NFT ${_nft} with tokenId ${_tokenId} to ${bank.contract}`,
      );
    },
    [bank, bombFinance, handleTransactionReceipt],
  );
  return { onNFTStake: handleNFTStake };
};

export default useNFTStake;
