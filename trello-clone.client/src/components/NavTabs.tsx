import { AppBar, Box, Tab, Tabs, IconButton, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../ColorModeContext';

const pages = [
  { label: 'Trello', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Tables', path: '/tables' },
];

function NavTabs() {
  const location = useLocation();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const currentTab = pages.findIndex(page => page.path === location.pathname) !== -1
    ? pages.findIndex(page => page.path === location.pathname)
    : 0;

  return (
    <AppBar position="static" color="default">
      <Box display="flex" alignItems="center">
        <Tabs value={currentTab} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ flex: 1 }}>
          {pages.map((page) => (
            <Tab key={page.path} label={page.label} component={Link} to={page.path} />
          ))}
        </Tabs>
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    </AppBar>
  );
}

export default NavTabs;
