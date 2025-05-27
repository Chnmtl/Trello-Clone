import { Box, Tab, Tabs, IconButton, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../ColorModeContext';

const pages = [
  { label: 'About', path: '/' },
  { label: 'Trello', path: '/trello' },
  { label: 'Tables', path: '/tables' },
];

function NavTabs({ leftContent }: { leftContent?: React.ReactNode }) {
  const location = useLocation();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const currentTab = pages.findIndex(page => page.path === location.pathname) !== -1
    ? pages.findIndex(page => page.path === location.pathname)
    : 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', bgcolor: 'background.paper', px: 2, py: 1 }}>
      {leftContent && (
        <Box sx={{ fontWeight: 'bold', fontSize: 28, letterSpacing: 1, mr: 4 }}>
          {leftContent}
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <Tabs value={currentTab} indicatorColor="primary" textColor="primary" sx={{ minHeight: 48 }}>
        {pages.map((page) => (
          <Tab key={page.path} label={page.label} component={Link} to={page.path} sx={{ minWidth: 100, fontWeight: 'bold' }} />
        ))}
      </Tabs>
      <IconButton sx={{ ml: 2 }} onClick={toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
}

export default NavTabs;
