import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Typography, Grid, Paper } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import ProgressCountdown from './components/ProgressCountdown';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/styles';

import PageHeader from '../../components/PageHeader';


const TITLE = '10mb.finance | Boardroom';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
  paperSeparator: {
    height: 1,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: -theme.spacing(3),
    marginRight: -theme.spacing(3),
    backgroundColor: 'hsla(0, 0%, 100%, .1)',
  },
  HighlightedTextSmall: {
    fontSize: '0.5em',
  },
}));

const BorderedPaper = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: 'transparent',
    border: '1px solid hsla(0, 0%, 100%, .1)',
  },
}))(Paper);

const CurrentEpochPaper = withStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    paddingLeft: 0,
    borderColor: theme.palette.text.yellow,
  },
}))(BorderedPaper);

const CurrentEpoch = withStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
    padding: theme.spacing(2),
    background: '#f9d749',
    color: theme.palette.primary.contrastText,
    fontWeight: 700,
    textAlign: 'center',
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
}))(Typography);

const HighlightedText = withStyles((theme) => ({
  root: {
    fontWeight: 700,
    color: theme.palette.text.yellow,
  },
}))(Typography);


const Boardroom = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnBoardroom();
  const boardroomAPR = useFetchBoardroomAPR();
  const canClaimReward = useClaimRewardCheck();
  const canWithdraw = useWithdrawCheck();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();

  const isPreview = false

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      {!!account ? (<>
                      <Grid style={{marginBottom: "5rem"}} container justifyContent="center">
                      <Grid item lg={10}>
                        <PageHeader title="Boardroom" subtitle="STAKE 10SHARE TO EARN 10MB!" />
                      </Grid>
                    </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CurrentEpochPaper>
                  <CurrentEpoch>
                    <div>Epoch</div>
                    <div>{isPreview ? 0 : Number(currentEpoch)}</div>
                  </CurrentEpoch>
                  <div>
                    <Typography style={{ textTransform: 'uppercase' }}>Next Epoch</Typography>
                    <ProgressCountdown
                      base={moment().toDate()}
                      hideBar={true}
                      deadline={to}
                      description="Next Epoch"
                      customRenderText={(text) => <HighlightedText variant="h5">{text}</HighlightedText>}
                    />
                  </div>
                </CurrentEpochPaper>
              </Grid>
              <Grid item xs={12}>
                <BorderedPaper>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography style={{ textTransform: 'uppercase' }} variant="body2">
                        Expansion rate
                      </Typography>
                      <HighlightedText variant="h5">--%</HighlightedText>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography style={{ textTransform: 'uppercase' }} variant="body2">
                        APR
                      </Typography>
                      <HighlightedText variant="h5">{boardroomAPR.toFixed(2)}%</HighlightedText>
                    </Grid>
                  </Grid>
                </BorderedPaper>
              </Grid>
              <Grid item xs={12}>
                <BorderedPaper>
                  <Typography style={{ textTransform: 'uppercase' }} variant="body2">
                    TVL in Boardroom
                  </Typography>
                  <HighlightedText variant="h5">--</HighlightedText>
                  <div className={classes.paperSeparator} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">10SHARE Staked</Typography>
                        <HighlightedText variant="body2">{isPreview ? "0.00" : getDisplayBalance(totalStaked)}</HighlightedText>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between">
                        <div>
                          <Typography variant="body2">
                            10MB PEG <small>(TWAP)</small>
                          </Typography>
                          <Typography variant="body2">per 10 10MB</Typography>
                        </div>
                        <HighlightedText variant="body2">{scalingFactor} USDC</HighlightedText>
                      </Box>
                    </Grid>
                  </Grid>
                  {/* 
                    <Box mb={2}>
                      <Typography style={{ textTransform: 'uppercase' }}>10SHARE Staked</Typography>
                      <HighlightedText variant="h5">{getDisplayBalance(totalStaked)}</HighlightedText>
                    </Box>
                    <Typography style={{ textTransform: 'uppercase' }}>
                      10MB PEG <small>(TWAP)</small>
                    </Typography>
                    <HighlightedText variant="h5">
                      {scalingFactor} USDC <small className={classes.HighlightedTextSmall}>per 10 10MB</small>
                    </HighlightedText> */}
                </BorderedPaper>
              </Grid>
              <Grid item xs={12}>
                <BorderedPaper>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Stake fee</Typography>
                        <HighlightedText variant="body2">2%</HighlightedText>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Unstake fee</Typography>
                        <HighlightedText variant="body2">0%</HighlightedText>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Next expansion amount</Typography>
                        <HighlightedText variant="body2" align="right">
                          0 10MB
                        </HighlightedText>
                      </Box>
                    </Grid>
                  </Grid>
                </BorderedPaper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={9}>
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={6}>
                <Harvest />
              </Grid>
              <Grid item xs={6}>
                <Stake />
              </Grid>
              <Grid item lg={6} style={{ display: 'flex' }}>
                <BorderedPaper>
                  <HighlightedText variant="body2" paragraph>
                    Stake &amp; Unstake
                  </HighlightedText>
                  <Typography variant="body2" paragraph>
                  There is a 2% tax fee on staking. The unstaking fee is 0% during expansion and 2% during contraction.
                  </Typography>
                  <Typography variant="body2">
                  Upon staking in the Boardroom, 10SHARE will be locked for 6 epochs. Any time the user claims rewards, stakes more 10SHARE, or unstakes fully/partially, both the lock and reward counters will be reset.
                  </Typography>
                </BorderedPaper>
              </Grid>
              <Grid item lg={6} style={{ display: 'flex' }}>
                <BorderedPaper>
                  <HighlightedText variant="body2" paragraph>
                  Claim 10MB Rewards
                  </HighlightedText>
                  <Typography variant="body2">
                  Rewards can be claimed after 3 epochs after deposit. Each time rewards are claimed, both the lock and reward counters will be reset.
                  </Typography>
                </BorderedPaper>
              </Grid>
            </Grid>
          </Grid>
        </Grid></>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

export default Boardroom;
