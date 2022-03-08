import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Typography, Grid, withStyles, Paper } from '@material-ui/core';
import { roundAndFormatNumber } from '../../0x';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useXbombBalance from '../../hooks/useXbombBalance';
import useXbombAPR from '../../hooks/useXbombAPR';
import useStakedTotalBombBalance from '../../hooks/useTotalStakedBombBalance';
import { Helmet } from 'react-helmet';

import PageHeader from '../../components/PageHeader';

const TITLE = 'bomb.money | xBOMB - BOMB Staking';

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
    color: theme.palette.text.yellow,
  },
}))(Typography);

const HighlightedBorderedPaper = withStyles((theme) => ({
  borderColor: theme.palette.text.yellow,
}))(BorderedPaper);

const Staking = () => {
  const { account } = useWallet();
  // const { onRedeem } = useRedeemOnBoardroom();
  //  const stakedBombBalance = useStakedBombBalance();
  const xbombBalance = useXbombBalance();
  const xbombRate = Number(xbombBalance / 1000000000000000000).toFixed(4);
  const xbombAPR = useXbombAPR();

  //const xbombTVL = xbombAPR.TVL;
  const stakedTotalBombBalance = useStakedTotalBombBalance();
  const bombTotalStaked = Number(stakedTotalBombBalance / 1000000000000000000).toFixed(0);
  const xbombTVL = useMemo(() => (xbombAPR ? Number(xbombAPR.TVL).toFixed(0) : null), [xbombAPR]);
  const xbombDailyAPR = useMemo(() => (xbombAPR ? Number(xbombAPR.dailyAPR).toFixed(2) : null), [xbombAPR]);
  const xbombYearlyAPR = useMemo(() => (xbombAPR ? Number(xbombAPR.yearlyAPR).toFixed(2) : null), [xbombAPR]);

  // console.log('xbombAPR', xbombYearlyAPR);

  // const cashStat = useCashPriceInEstimatedTWAP();

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      {!!account ? (
        <>
          <Box mb={4}>
            <Grid container justifyContent="center">
              <Grid item xs={12} lg={10}>
                <PageHeader
                  title="BOMB Staking for xBOMB"
                  rightNode={
                    <HighlightedBorderedPaper elevation={0}>
                      <Typography align="center" style={{ textTransform: 'uppercase' }}>
                        Current rate
                      </Typography>
                      <HighlightedText align="center" style={{ textTransform: 'uppercase' }}>
                        1 xBOMB = {Number(xbombRate)} BOMB
                      </HighlightedText>
                    </HighlightedBorderedPaper>
                  }
                />
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" mb={3} justifyContent="center">
            <Alert variant="filled" severity="info" maxWidth={600}>
              <b> Most rewards are generated from boardroom printing! Rewards come from:</b>
              <br />
              - 80% of autocompounder fees are used to buy BOMB on the open market
              <br />
              - 20% of all BOMB minted - from protocol allocation, does not impact BSHARE boardroom printing.
              <br />
              If TWAP of BOMB peg is not over 1.01, yield will be reduced.
              <br />
              APR is based on performance since launch on January 24th, 2022.
            </Alert>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={12}>
                  <BorderedPaper>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography style={{ textTransform: 'uppercase' }} variant="body2">
                          APR
                        </Typography>
                        <HighlightedText variant="h5">{xbombYearlyAPR}%</HighlightedText>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography style={{ textTransform: 'uppercase' }} variant="body2">
                          Daily APR
                        </Typography>
                        <HighlightedText variant="h5">{xbombDailyAPR}%</HighlightedText>
                      </Grid>
                    </Grid>
                  </BorderedPaper>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <BorderedPaper>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Bomb staked</Typography>
                          <HighlightedText variant="body2">{roundAndFormatNumber(bombTotalStaked)}</HighlightedText>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Bomb staked USD</Typography>
                          <HighlightedText variant="body2">${roundAndFormatNumber(xbombTVL, 2)}</HighlightedText>
                        </Box>
                      </Grid>
                    </Grid>
                  </BorderedPaper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={9}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Stake />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <BorderedPaper>
                    <HighlightedText variant="body2" paragraph>
                      About xBOMB &amp; Rewards
                    </HighlightedText>
                    <Typography variant="body2" paragraph>
                      xBOMB will be the governance token required to cast votes on protocol decisions.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      20% of all BOMB minted will be deposited into the xBOMB smart contract, increasing the amount of
                      BOMB that can be redeemed for each xBOMB. Rewards will be deposited at random times to prevent
                      abuse.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Functionality will be developed around xBOMB including using it as collateral to borrow other
                      assets.
                    </Typography>
                    <Typography variant="body2">
                      Reward structure subject to change based on community voting.
                    </Typography>
                  </BorderedPaper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

export default Staking;
