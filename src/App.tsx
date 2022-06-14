import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as TP } from '@material-ui/core/styles';
import styled, { ThemeProvider as TP1 } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import usePromptNetwork from './hooks/useNetworkPrompt';
import BanksProvider from './contexts/Banks';
import BombFinanceProvider from './contexts/BombFinanceProvider';
import ModalsProvider from './contexts/Modals';
import store from './state';
import theme from './theme';
import newTheme from './newTheme';
import config from './config';
import Updaters from './state/Updaters';
import Loader from './components/Loader';
import Popups from './components/Popups';
//import Regulations from './views/Regulations/Regulations';
import { RefreshContextProvider } from './contexts/RefreshContext';
import tenWhiteImg from './assets/img/10-large.png';
import tenWhiteTransImg from './assets/img/10-large-transparent.png';

const Home = lazy(() => import('./views/Home'));
const Farm = lazy(() => import('./views/Farm'));
const Boardroom = lazy(() => import('./views/Boardroom'));
const Bond = lazy(() => import('./views/Bond'));
const Mint = lazy(() => import('./views/Mint'));
const Xbomb = lazy(() => import('./views/Stake'));
const Supply = lazy(() => import('./views/Supply'));
// const SBS = lazy(() => import('./views/Sbs'));
// const Liquidity = lazy(() => import('./views/Liquidity'));

const NoMatch = () => (
  <h3 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    URL Not Found. <a href="/">Go back home.</a>
  </h3>
);

const BackgroundAdornment = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-image: url(${tenWhiteImg});
  background-size: 180px;
  background-repeat: no-repeat;
  background-position: 20px calc(30% + 30px);
  opacity: 0.2;
  z-index: -1;
`;

const BackgroundAdornment2 = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-image: url(${tenWhiteTransImg});
  background-size: 80px;
  background-repeat: no-repeat;
  background-position: 40px calc(30% - 50px);
  opacity: 0.4;
  z-index: -1;
`;


const BackgroundAdornment3 = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-image: url(${tenWhiteImg});
  background-size: 180px;
  background-repeat: no-repeat;
  background-position: 90% calc(70% - 340px);
  opacity: 0.2;
  z-index: -1;
`;

const BackgroundAdornment4 = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-image: url(${tenWhiteTransImg});
  background-size: 80px;
  background-repeat: no-repeat;
  background-position: calc(90% - 30px) calc(70% - 280px);
  opacity: 0.4;
  z-index: -1;
`;


const BackgroundAdornment5 = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-image: url(${tenWhiteImg});
  background-size: 180px;
  background-repeat: no-repeat;
  background-position: calc(30%) 70%;
  opacity: 0.2;
  z-index: -1;
`;

const BackgroundAdornment6 = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-image: url(${tenWhiteTransImg});
  background-size: 80px;
  background-repeat: no-repeat;
  background-position: calc(30% + 20px) calc(70% + -80px);
  opacity: 0.4;
  z-index: -1;
`;


const BackgroundAdornment7 = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-image: url(${tenWhiteImg});
  background-size: 180px;
  background-repeat: no-repeat;
  background-position: calc(80% - 80px) 72%;
  opacity: 0.2;
  z-index: -1;
`;

const BackgroundAdornment8 = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-image: url(${tenWhiteTransImg});
  background-size: 80px;
  background-repeat: no-repeat;
  background-position: calc(80% - 30px) calc(70% + 80px);
  opacity: 0.4;
  z-index: -1;
`;

const App: React.FC = () => {
  // Clear localStorage for mobile users
  if (typeof localStorage.version_app === 'undefined' || localStorage.version_app !== '1.1') {
    localStorage.clear();
    localStorage.setItem('connectorId', '');
    localStorage.setItem('version_app', '1.1');
  }

  usePromptNetwork();

  return (
    <Providers>
      <BackgroundAdornment />
      <BackgroundAdornment2 />
      <BackgroundAdornment3 />
      <BackgroundAdornment4 />
      <BackgroundAdornment5 />
      <BackgroundAdornment6 />
      <BackgroundAdornment7 />
      <BackgroundAdornment8 />
      <Router>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/farm">
              <Farm />
            </Route>
            <Route path="/boardroom">
              <Boardroom />
            </Route>
            <Route path="/bond">
              <Bond />
            </Route>
            <Route path="/mint">
              <Mint />
            </Route>
            {/*<Route path="/xbomb">
              <Xbomb />
            </Route>
            <Route path="/supply">
              <Supply />
            </Route>
             <Route path="/sbs">
              <SBS />
            </Route> */}
            {/* <Route path="/regulations">
              <Regulations />
            </Route> */}
            {/* <Route path="/liquidity">
              <Liquidity />
            </Route> */}
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </Providers>
  );
};

const Providers: React.FC = ({ children }) => {
  return (
    <TP1 theme={theme}>
      <TP theme={newTheme}>
        <UseWalletProvider
          chainId={config.chainId}
          connectors={{
            walletconnect: { rpcUrl: config.defaultProvider },
            walletlink: {
              url: config.defaultProvider,
              appName: '10mb.finance',
              appLogoUrl: 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bomb-512.png',
            },
          }}
        >
          <Provider store={store}>
            <Updaters />
            <RefreshContextProvider>
              <BombFinanceProvider>
                <ModalsProvider>
                  <BanksProvider>
                    <>
                      <Popups />
                      {children}
                    </>
                  </BanksProvider>
                </ModalsProvider>
              </BombFinanceProvider>
            </RefreshContextProvider>
          </Provider>
        </UseWalletProvider>
      </TP>
    </TP1>
  );
};

export default App;
