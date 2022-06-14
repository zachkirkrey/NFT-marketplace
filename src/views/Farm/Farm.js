import React from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';

import { Box, Container, Typography, Grid } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import FarmCard from './FarmCard';

import useBanks from '../../hooks/useBanks';
import { Helmet } from 'react-helmet';

import PageHeader from '../../components/PageHeader';

const TITLE = '10mb.finance | Farms';

const Farm = () => {
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const activeBanks = banks.filter((bank) => !bank.finished);

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <Helmet>
            <title>{TITLE}</title>
          </Helmet>
          {!!account ? (
            <Container maxWidth="lg">
              <Grid container justifyContent="center">
                <Grid item lg={10}>
                  <PageHeader title="Farm" subtitle="Stake LP tokens to earn 10SHARE. During the genesis period, stake single tokens to earn 10MB!" />
                </Grid>
              </Grid>

              <Box mt={5}>
                <div hidden={!activeBanks.some((bank) => bank.sectionInUI === 2)}>
                  {/* <Alert variant="filled" severity="info">
                    <h4>
                      Farms started November 25th 2021 and will continue running for 1 full year.</h4>
                  </Alert> */}
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 2)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div hidden={!activeBanks.some((bank) => bank.sectionInUI === 1)}>
                  <Typography
                    color="textPrimary"
                    variant="h5"
                    component="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    Inactive ApeSwap Farms
                  </Typography>
                  <Alert variant="filled" severity="warning">
                    Please remove funds from all farms which are not active.
                  </Alert>
                  <Grid container spacing={3} style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 1)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div hidden={!activeBanks.some((bank) => bank.sectionInUI === 0)}>
                  <Typography
                    color="textPrimary"
                    variant="h5"
                    component="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    Genesis Pools
                  </Typography>
                  <Alert variant="filled" severity="warning">
                    Genesis pools have ended. Please claim all rewards and remove funds from Genesis pools.
                  </Alert>
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} key={bank.name} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:bankId/:poolId`}>
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Farm;
