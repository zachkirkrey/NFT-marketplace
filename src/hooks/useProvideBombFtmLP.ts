import {useCallback} from 'react';
import useBombFinance from './useBombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {parseUnits} from 'ethers/lib/utils';
import {TAX_OFFICE_ADDR} from '../utils/constants';

const useProvideBombFtmLP = () => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideBombFtmLP = useCallback(
    (croAmount: string, bombAmount: string) => {
      const bombAmountBn = parseUnits(bombAmount);
      handleTransactionReceipt(
        bombFinance.provideBombFtmLP(croAmount, bombAmountBn),
        `Provide _10MB-USDT LP ${bombAmount} ${croAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [bombFinance, handleTransactionReceipt],
  );
  return {onProvideBombFtmLP: handleProvideBombFtmLP};
};

export default useProvideBombFtmLP;
