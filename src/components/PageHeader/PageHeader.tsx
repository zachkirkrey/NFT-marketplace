import { Grid, Paper, withStyles } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const HighlightedPaper = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: '#0d3b81',
    boxShadow: 'inset 0 -4px 0 #274d87',
  },
}))(Paper);

interface PageHeaderProps {
  subtitle?: string;
  title?: string;
  rightNode?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ subtitle, title, rightNode }) => {
  return (
    <HighlightedPaper>
      <Grid container spacing={3} alignItems="center" justifyContent="space-between">
        <Grid item>
          <StyledTitle>{title}</StyledTitle>
          {subtitle ? <StyledSubtitle>{subtitle}</StyledSubtitle> : null}
        </Grid>
        <Grid item>{rightNode}</Grid>
      </Grid>
    </HighlightedPaper>
  );
};

const StyledTitle = styled.h1`
  margin: 0;
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
