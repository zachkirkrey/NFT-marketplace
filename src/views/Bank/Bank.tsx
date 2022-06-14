import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import { Box, Button, Typography, Grid, withStyles, Paper } from '@material-ui/core';

import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import NFTStake from './components/NFTStake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../bomb-finance';
import useBombFinance from '../../hooks/useBombFinance';
import { Alert } from '@material-ui/lab';

const BorderedPaper = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: 'transparent',
    border: '1px solid hsla(0, 0%, 100%, .1)',
  },
}))(Paper);

const HighlightedText = withStyles((theme) => ({
  root: {
    fontWeight: 700,
    color: '#f9d749',
  },
}))(Typography);


const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const { bankId, poolId } = useParams();
  console.log('poolId ', poolId);
  const bank = useBank(bankId, poolId);

  console.log('bank ', bank);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);

  let vaultUrl: string;
  if (bank.depositTokenName.includes('10MB-USDC')) {
    vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-USDC';
  } else if (bank.depositTokenName.includes('10MB-_10SHARE')) {
    vaultUrl = 'https://www.bomb.farm/#/bsc/';
  } else {
    vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bshare-wbnb';
  }

  const isPreview = false

  return account && bank ? (
    <>
      <Box mb={4}>
        <Grid container justifyContent="center">
          <Grid item lg={10}>
            <PageHeader
              title={bank?.name}
              subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
            />
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" mb={3} justifyContent="center">
        {/*<Alert variant="filled" severity="info">
          <h3>Our autocompounding vaults are live!</h3>
          We support zapping tokens, and auto-compound every 2 hours!
          <br />
          Check it out here: <a href={vaultUrl}>{vaultUrl}</a>
  </Alert>*/}
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <BorderedPaper>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography style={{ textTransform: 'uppercase' }} variant="body2">
                      APR
                    </Typography>
                    <HighlightedText variant="h5">
                      {isPreview ? '0.00' : bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%
                    </HighlightedText>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ textTransform: 'uppercase' }} variant="body2">
                      Daily APR
                    </Typography>
                    <HighlightedText variant="h5">
                      {isPreview ? '0.00' : bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%
                    </HighlightedText>
                  </Grid>
                </Grid>
              </BorderedPaper>
            </Grid>

            <Grid item xs={12} md={6} lg={12}>
              <BorderedPaper>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography style={{ textTransform: 'uppercase' }} variant="body2">
                      TVL
                    </Typography>
                    <HighlightedText variant="h5">${statsOnPool?.TVL}</HighlightedText>
                  </Grid>
                </Grid>
              </BorderedPaper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Harvest bank={bank} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stake bank={bank} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NFTStake bank={bank} slotId={1} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NFTStake bank={bank} slotId={2} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NFTStake bank={bank} slotId={3} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Spacer size="lg" />
        {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />}
        <Spacer size="lg" />
        <div>
          <Button onClick={() => {
              if (isPreview) {
                alert("Please wait for the site to be fully online!")
                return
              }
            onRedeem()
          }} className="shinyButtonSecondary">
            Claim &amp; Withdraw
          </Button>
        </div>
        <Spacer size="lg" />
      </Box>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  const bombFinance = useBombFinance();
  const bombAddr = bombFinance["10MB"].address;
  const bshareAddr = bombFinance["10SHARE"].address;

  const isPreview = false

  let pairName: string;
  let uniswapUrl: string;
  // let vaultUrl: string;
  if (bank.depositTokenName.includes('10MB-USDC')) {
    pairName = '10MB-USDC pair';
    uniswapUrl = 'https://mm.finance/add/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/' + bombAddr;
    //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-USDC';
  } else if (bank.depositTokenName.includes('10MB-10SHARE')) {
    pairName = '10MB-10SHARE pair';
    uniswapUrl = 'https://mm.finance/add/' + bombAddr + '/' + bshareAddr;
    //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-USDC';
  } else {
    pairName = '10SHARE-CRO pair';
    uniswapUrl = 'https://mm.finance/add/CRO/' + bshareAddr;
    //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-10SHARE-CRO';
  }
  return (
    <Paper>
      <Box p={2}>
        <StyledLink onClick={() => {
              if (isPreview) {
                alert("Please wait for the site to be fully online!")
                return
              }
        }}
        href={isPreview ? '' : uniswapUrl} target={isPreview ? '' : "_blank"}>
          {`Provide liquidity for ${pairName} now on MMF`}
        </StyledLink>
      </Box>
    </Paper>
  );
};

const BankNotFound = () => {
  return <PageHeader title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />;
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export default Bank;
