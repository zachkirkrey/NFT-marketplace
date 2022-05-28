import { useContext } from 'react';
import { Context as BanksContext } from '../contexts/Banks';
import { Bank, ContractName } from '../bomb-finance';

const useBank = (contractName: ContractName, pid: Number): Bank => {
  const { banks } = useContext(BanksContext);
  console.log('banks ', banks);
  console.log('pid ', pid);
  return banks.find((bank) => bank.contract === contractName && bank.poolId == pid);
};

export default useBank;
