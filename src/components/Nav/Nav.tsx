import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Box, Drawer, IconButton, Toolbar, List, useMediaQuery } from '@material-ui/core';

import ListItemLink from '../ListItemLink';
import useBombStats from '../../hooks/useBombStats';
import useUSDTStats from '../../hooks/useUSDTStats';
import useShareStats from '../../hooks/usebShareStats';

import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import AccountButton from './AccountButton';

//import bombLogo from '../../assets/img/bomb-logo.png';
import bombLogo from '../../assets/img/10mb-logo.png';
import { roundAndFormatNumber } from '../../0x';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    backgroundColor: 'transparent',
    marginBottom: '3rem',
    transition: 'background-color linear .1s',
  },
  appBarBackground: {
    backgroundColor: '#0d2048',
  },
  drawerPaper: {
    width: 240,
    height: 'auto',
    top: 65,
    bottom: 0,
    backgroundColor: '#001226',
    padding: theme.spacing(2),

    [theme.breakpoints.up('sm')]: {
      width: 300,
    },
  },
  toolbar: {
    height: 65,
  },
  link: {
    [theme.breakpoints.up('lg')]: {
      padding: '0 8px',
      textTransform: 'uppercase',
      textDecoration: 'none',
      fontSize: '15px',
    },
  },
  logo: {
    height: 40,
    marginTop: -10,
    marginRight: 10,
  },
}));

const Nav = () => {
  const displayNavWithoutDrawer = useMediaQuery('(min-width: 1440px)');
  const displayRatesInAppbar = useMediaQuery('(min-width: 768px)');
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const bombStats = useBombStats();
  const USDTStats = useUSDTStats();
  const shareStats = useShareStats();

  const [navBackgroundTransparent, setNavBackgroundTransparent] = useState(true);

  const handleScroll = () => {
    if (window.scrollY > 65) {
      setNavBackgroundTransparent(false);
    } else {
      setNavBackgroundTransparent(true);
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const USDTPriceInDollars = useMemo(() => (USDTStats ? Number(USDTStats).toFixed(2) : null), [USDTStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const sharePriceInDollars = useMemo(
    () => (shareStats ? Number(shareStats.priceInDollars).toFixed(2) : null),
    [shareStats],
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className={`${classes.appBar} ${!navBackgroundTransparent ? classes.appBarBackground : ''}`}
    >
      <Toolbar className={classes.toolbar}>
        {displayNavWithoutDrawer ? (
          <>
            <Link to="/" style={{ display: 'flex', color: 'inherit', marginTop: '-8px' }}>
              <img alt="bomb.money" src={bombLogo} height="46px" />
            </Link>
            <Box style={{ paddingLeft: '15px', fontSize: '1rem', flexGrow: '1' }}>
              <Link to="/" className={'navLink ' + classes.link}>
                Home
              </Link>
              <Link to="/farm" className={'navLink ' + classes.link}>
                Farm
              </Link>
              <Link to="/boardroom" className={'navLink ' + classes.link}>
                Boardroom
              </Link>
              {/*<Link to="/xbomb" className={'navLink ' + classes.link}>
                x_10MB
              </Link>*/}
              <Link to="/bond" className={'navLink ' + classes.link}>
                Bond
              </Link>
              <Link to="/mint" className={'navLink ' + classes.link}>
                Mint
              </Link>
              {/* <Link color="textPrimary" to="/sbs" className={classes.link}>
                SBS
              </Link>
              <Link color="textPrimary" to="/liquidity" className={classes.link}>
                Liquidity
              </Link>
              <Link color="textPrimary" to="/regulations" className={classes.link}>
                Regulations
              </Link> 
              <a
                href="https://bombUSDT.com"
                className={'navLink ' + classes.link}
                rel="noopener noreferrer"
                //  target="_blank"
              >
                USDT Staking
              </a>

              <a
                href="https://bomb.farm"
                className={'navLink ' + classes.link}
                rel="noopener noreferrer"
                //  target="_blank"
              >
                Vaults
              </a>
              <a
                href="https://shop.bomb.money"
                className={'navLink ' + classes.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                Merch
              </a>
              <a
                href="https://vote.bomb.money"
                className={'navLink ' + classes.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                Vote
              </a>*/}
              <a
                href="https://docs.bomb.money"
                className={'navLink ' + classes.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                Docs
              </a>
            </Box>

            <Box
              style={{
                flexGrow: '0',
                paddingLeft: '15px',
                paddingTop: '5px',
                fontSize: '1rem',
                paddingRight: '15px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="navTokenIcon bomb"></div>{' '}
              <div className="navTokenPrice">${roundAndFormatNumber(Number(bombPriceInDollars), 2)}</div>
              <div className="navTokenIcon bshare"></div>{' '}
              <div className="navTokenPrice">${roundAndFormatNumber(Number(sharePriceInDollars), 2)}</div>
              <div className="navTokenIcon USDT"></div>{' '}
              <div className="navTokenPrice">${roundAndFormatNumber(Number(USDTPriceInDollars), 2)}</div>
            </Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start">
              <MenuIcon />
            </IconButton>
            <Link to="/" style={{ display: 'flex' }}>
              <img alt="bomb.money" src={bombLogo} className={classes.logo} />
            </Link>
            <Box display="flex" alignItems="center" ml="auto">
              {displayRatesInAppbar ? (
                <Box display="flex" alignItems="center">
                  <div className="navTokenIcon bomb"></div>{' '}
                  <div className="navTokenPrice">${roundAndFormatNumber(Number(bombPriceInDollars), 2)}</div>
                  <div className="navTokenIcon bshare"></div>{' '}
                  <div className="navTokenPrice">${roundAndFormatNumber(Number(sharePriceInDollars), 2)}</div>
                  <div className="navTokenIcon USDT"></div>{' '}
                  <div className="navTokenPrice">${roundAndFormatNumber(Number(USDTPriceInDollars), 2)}</div>
                </Box>
              ) : null}
              <AccountButton text="Connect" />
            </Box>
            <Drawer
              onClose={handleDrawerClose}
              // onEscapeKeyDown={handleDrawerClose}
              // onBackdropClick={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <List>
                {!displayRatesInAppbar ? (
                  <>
                    <Box display="flex" alignItems="center" mb={2}>
                      <div className="navTokenIcon bomb"></div>{' '}
                      <div className="navTokenPrice">${roundAndFormatNumber(Number(bombPriceInDollars), 2)}</div>
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <div className="navTokenIcon bshare"></div>{' '}
                      <div className="navTokenPrice">${roundAndFormatNumber(Number(sharePriceInDollars), 2)}</div>
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <div className="navTokenIcon USDT"></div>{' '}
                      <div className="navTokenPrice">${roundAndFormatNumber(Number(USDTPriceInDollars), 2)}</div>
                    </Box>
                  </>
                ) : null}
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Farm" to="/farm" />
                <ListItemLink primary="Boardroom" to="/boardroom" />
                {/*<ListItemLink primary="x_10MB" to="/xbomb" />*/}
                <ListItemLink primary="Bond" to="/bond" />
                <ListItemLink primary="Mint" to="/mint" />
                {/*<ListItemLink primary="USDT Staking" href="https://bombUSDT.com" />*/}
                {/*<ListItemLink primary="Vaults" href="https://bomb.farm" />*/}
                {/* <ListItemLink primary="SBS" to="/sbs" /> */}
                {/* <ListItemLink primary="Liquidity" to="/liquidity" /> */}
                {/* <ListItemLink primary="Regulations" to="/regulations" /> */}
                {/*<ListItemLink primary="Merch" href="https://shop.bomb.money" />*/}
                {/*<ListItemLink primary="Vote" href="https://vote.bomb.money" />*/}
                {/*<ListItemLink primary="Docs" href="https://docs.bomb.money" />*/}
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
