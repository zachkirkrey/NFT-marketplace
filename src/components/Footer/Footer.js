import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Link } from '@material-ui/core';

import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { ReactComponent as IconTwitter } from '../../assets/img/twitter.svg';
import { ReactComponent as IconGithub } from '../../assets/img/github.svg';
import { ReactComponent as IconDiscord } from '../../assets/img/discord.svg';
import { withStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    overflow: 'hidden',
    marginTop: 80,
    width: '100%',
    color: 'white',
    backgroundColor: '#000f26',
    textAlign: 'center',

    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  bottom: {
    paddingTop: 27,
    paddingBottom: 27,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },

  links: {
    paddingTop: 72,
    paddingBottom: 40,
  },

  link: {
    display: 'table',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 14,

    '&:not(:last-child)': {
      marginBottom: 12,
    },
  },

  iconLink: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
  },

  img: {
    width: '24px',
    height: '24px',
  },
}));

const FooterLinksHeader = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 700,
    fontSize: 14,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
}))(Typography);

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container className={classes.links} justifyContent="flex-end" spacing={10}>
          <Grid item>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" className={classes.bottom}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body2" color="textPrimary" align="left">
              {'Copyright © '}
              <Link color="inherit" href="/">
              Sugandese Tokens
              </Link>{' '}
              {new Date().getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right', height: '20px' }}>
            <a
              href="https://twitter.com/PolyWantsAFarm"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.iconLink}
            >
              <IconTwitter style={{ fill: '#dddfee' }} />
            </a>
            <a
              href="https://github.com/LithiumSwapTech"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.iconLink}
            >
              <IconGithub style={{ fill: '#dddfee', height: '20px' }} />
            </a>
            <a href="https://t.me/PolyWantsACracker_Farm" rel="noopener noreferrer" target="_blank" className={classes.iconLink}>
              <IconTelegram style={{ fill: '#dddfee', height: '20px' }} />
            </a>
            <a href="https://discord.gg/raxn6h9vy5" rel="noopener noreferrer" target="_blank" className={classes.iconLink}>
              <IconDiscord style={{ fill: '#dddfee', height: '20px' }} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
