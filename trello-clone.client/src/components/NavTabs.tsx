import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const pages = [
  { label: 'Trello', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Tables', path: '/tables' },
];

function NavTabs() {
  const location = useLocation();
  const currentTab = pages.findIndex(page => page.path === location.pathname) !== -1
    ? pages.findIndex(page => page.path === location.pathname)
    : 0;

  return (
    <AppBar position="static" color="default">
      <Tabs value={currentTab} indicatorColor="primary" textColor="primary" variant="fullWidth">
        {pages.map((page, idx) => (
          <Tab key={page.path} label={page.label} component={Link} to={page.path} />
        ))}
      </Tabs>
    </AppBar>
  );
}

export default NavTabs;
