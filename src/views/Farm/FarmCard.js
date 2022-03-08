import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grid, Paper } from '@material-ui/core';

import TokenSymbol from '../../components/TokenSymbol';

const FarmCard = ({ bank }) => {
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Paper>
        <Box p={3}>
          <Grid container spacing={2} justifyContent="space-between" wrap={'nowrap'}>
            <Grid item>
              <Typography variant="h5" component="h2">
                {bank.depositTokenName}
              </Typography>
              <Typography color="textSecondary">
                {/* {bank.name} */}
                Deposit {bank.depositTokenName.toUpperCase()} Earn {` ${bank.earnTokenName}`}
              </Typography>
            </Grid>
            <Grid item>
              <TokenSymbol size={32} symbol={bank.depositTokenName} />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <Button className="shinyButtonSecondary" component={Link} to={`/farm/${bank.contract}`}>
              View
            </Button>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default FarmCard;
