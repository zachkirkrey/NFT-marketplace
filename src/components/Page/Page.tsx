import React from 'react';
import { Container, withStyles } from '@material-ui/core';
import useEagerConnect from '../../hooks/useEagerConnect';

import Footer from '../Footer';
import Nav from '../Nav';

const StyledContainer = withStyles({
  root: {
    marginBottom: 'auto',
  },
})(Container);

const Page: React.FC = ({ children }) => {
  useEagerConnect();
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <StyledContainer maxWidth="lg">{children}</StyledContainer>
      <Footer />
    </div>
  );
};

export default Page;
