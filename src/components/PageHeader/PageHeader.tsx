import { Paper, withStyles } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { bgGradient } from '../../theme/colors';

const HighlightedPaper = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: '#0d3b81',
    boxShadow: 'inset 0 -4px 0 #274d87',
  },
}))(Paper);

interface PageHeaderProps {
  icon: React.ReactNode;
  subtitle?: string;
  title?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, subtitle, title }) => {
  return (
    <HighlightedPaper>
      {/* <StyledIcon>{icon}</StyledIcon> */}
      <StyledTitle>{title}</StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
    </HighlightedPaper>
  );
};

const StyledTitle = styled.h1`
  margin-bottom: 16px;
  color: '#f9d749';
  font-size: 36px;
  font-weight: 700;
`;

const StyledSubtitle = styled.h3`
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
`;

export default PageHeader;
