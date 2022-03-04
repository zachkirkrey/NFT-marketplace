import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemText, withStyles } from '@material-ui/core';
import { matchPath, useLocation } from 'react-router';

const styledBy = (property, mapping) => (props) => mapping[props[property]];

const StyledListItem = withStyles({
  root: {
    borderRadius: 8,
    backgroundColor: styledBy('active', {
      true: '#119afa',
      false: 'transparent',
    }),

    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
})(ListItem);

const StyledListItemText = withStyles({
  primary: {
    fontWeight: 700,
  },
})(ListItemText);

const ListItemLink = ({ primary, to = undefined, href = undefined }) => {
  const location = useLocation();
  const isActive = !!matchPath(to, {
    path: location.pathname,
    exact: true,
    strict: false,
  });

  console.log('to location.pathname isActive', to, location.pathname, isActive);

  const CustomLink = React.useMemo(() => {
    return React.forwardRef((linkProps, ref) => <Link ref={ref} to={to} {...linkProps} />);
  }, [to]);

  return to ? (
    <StyledListItem button active={isActive} component={CustomLink}>
      <StyledListItemText primary={primary} />
    </StyledListItem>
  ) : (
    <StyledListItem button component="a" href="https://bombbtc.com">
      <StyledListItemText primary={primary} />
    </StyledListItem>
  );
};

export default ListItemLink;
