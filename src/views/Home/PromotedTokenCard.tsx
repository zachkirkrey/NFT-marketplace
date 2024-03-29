import { Box, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import TokenSymbol from '../../components/TokenSymbol';
import LaunchIcon from '@material-ui/icons/Launch';

const useClasses = makeStyles((theme) => ({
  box: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '4px 16px',
    fontSize: 14,
    fontWeight: 700,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  badgeTreasure: {
    background: 'linear-gradient(98.45deg, rgb(17, 154, 250) 1.89%, rgb(54, 216, 70) 99.09%)',
  },
  badgeInvested: {
    background: 'linear-gradient(130.95deg, rgb(16, 156, 244) 5%, rgb(93, 63, 255) 90.82%)',
  },
}));

const Value = withStyles((theme) => ({
  root: {
    marginTop: 4,
    fontWeight: 700,
    color: '#f9d749',
  },
}))(Typography);

const StyledIconButton = withStyles((theme) => ({
  root: {
    marginTop: -12,
    color: theme.palette.text.secondary,
  },
}))(IconButton);

const LinkGridItem = withStyles((theme) => ({
  root: {
    display: 'none',
  },

  [theme.breakpoints.up('sm')]: {
    root: {
      display: 'block',
    },
  },
}))(Grid);

type PromotedTokenCardProps = {
  type: 'treasure' | 'invested';
};

const labelMap = {
  treasure: 'Supply',
  invested: 'Collateral',
};

const classesMap = {
  treasure: 'badgeTreasure',
  invested: 'badgeInvested',
};

export const PromotedTokenCard: React.FC<PromotedTokenCardProps> = ({ type }) => {
  const classes = useClasses();

  return (
    <Box p={3} pt={5} className={classes.box}>
      <div className={`${classes.badge} ${classes[classesMap[type] as 'badgeTreasure' | 'badgeInvested']}`}>
        {labelMap[type]}
      </div>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs={12} sm="auto">
          <Box display="flex" justifyContent="space-between">
            <TokenSymbol symbol="10MB" size={48} />
            <Box display={{ sm: 'none', md: 'none', lg: 'none', xl: 'none' }}>
              <StyledIconButton>
                <a style={{color: 'white'}} href='' target="_blank">
                  <LaunchIcon />
                </a>
              </StyledIconButton>
            </Box>
          </Box>
        </Grid>
        {labelMap[type] == "Supply" ?<>
        <Grid item xs={12} sm="auto">
          <Box textAlign={['center', 'left']}>
            <Typography variant="body2">Iron Supply</Typography>
            <Value>0.00 10MB</Value>
          </Box>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Box textAlign={['center', 'left']}>
            <Typography variant="body2">Tomb Supply</Typography>
            <Value>0.00 10MB</Value>
          </Box>
        </Grid></>
        :<>
        <Grid item xs={12} sm="auto">
          <Box textAlign={['center', 'left']}>
            <Typography variant="body2">Total Supply</Typography>
            <Value>0.00 10MB</Value>
          </Box>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Box textAlign={['center', 'left']}>
            <Typography variant="body2">Backing Per 10MB</Typography>
            <Value>0.0000 USDC</Value>
          </Box>
        </Grid></>
  }
        <LinkGridItem item xs={12} sm="auto">
          <StyledIconButton >
            <a style={{color: 'white'}} href='' target="_blank">
              <LaunchIcon />
            </a>
          </StyledIconButton>
        </LinkGridItem>
      </Grid>
    </Box>
  );
};
