import React, { useCallback, useMemo, useState } from 'react';
import Page from '../../components/Page';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useModal from '../../hooks/useModal';
import useCatchError from '../../hooks/useCatchError';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import ExchangeModal from './components/ExchangeModal';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import { Alert } from '@material-ui/lab';
import MintRedeem from './components/MintRedeem';

import { Box, Grid, Button, Card } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { BigNumber } from 'ethers';

const TITLE = 'bomb.money | Mint';

const Mint: React.FC = () => {
  const { account } = useWallet();

  return (
    <Switch>
      <Page>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        {!!account ? <MintRedeem /> : <UnlockWallet />}
      </Page>
    </Switch>
  );
};

export default Mint;
